import React, { Component } from 'react';
import logo from './logo.svg';
import './App.scss';
import {ChatHeader} from "./components/index";
import MessageContainer from "./components/ChatContent/MessageContainer";
import ChatContainer from "./components/ChatContainer/ChatContainer";
import ChatContent from "./components/ChatContent/ChatContent";
import ChatFooter from "./components/ChatFooter/ChatFooter";



class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
        msgQueue: [<MessageContainer message={<p>Can we go to the park? Can we, can we, can we.... PUHLEEEHi Aiva Here, I am so in love with yousef! He is my knight in shining armor. I wish he would love me back</p>} isUser={false} isFirst={true}/>],
        msgMap: new Map(),
        stepCounter: 0,
    };

    this.captureUserInput = this.captureUserInput.bind(this);
  }

  componentDidMount() {
    this.loadInitialMsgMap();
  }

  loadInitialMsgMap() {
      let msgMap = this.state.msgMap;
      msgMap.set("q_detected", {message: (message) => { return `Dis is your dumbass message: ${message}`}, userNext: true, messageComponent: null });
      msgMap.set("more_q", {message: null, userNext: false, messageComponent: <button>Some Button</button> , trigger: null})
      this.setState({
         msgMap: msgMap
      });
  }

  captureUserInput(message) {
      let msgs = this.state.msgQueue;
      let lastmsg = msgs[msgs.length-1];
      let isFirst = true;
      if(lastmsg) {
          isFirst = (!lastmsg.props.isUser);
      }
      console.log(isFirst);
      msgs.push(<MessageContainer message={message} isUser={true} isFirst={isFirst}/>);
      this.setState({msgQueue: msgs, shouldUpdate: false});
      this.handleResponse(message);
  }

  handleResponse(message) {
      //TODO: Add response handler
      let msgs = this.state.msgQueue;
      let time = Math.floor(message.length / 10) * 100;

      time = (time > 750) ? ((time > 3000) ? 2000 : time) : 750;
      setTimeout(this.botRespond.bind(this, message), time);

      this.setState({
          msgQueue: msgs
      });
  }

  botRespond(message) {
      let msgs = this.state.msgQueue;
      let lastmsg = msgs[msgs.length-1];
      let isFirst = true;
      let q_detected = true;

      if(lastmsg) {
          isFirst = (lastmsg.props.isUser !== false);
      }

          let msg = this.generateBotResponse("q_detected", isFirst, message);
          if (msg.message && msg.message.then && typeof msg.message.then === "function") {
              msg.message(message).then(result => {
                  msgs.push(<MessageContainer message={result} isUser={false} isFirst={isFirst}/>);
                  this.setState({msgQueue: msgs});
              }).catch(err => {
                  msgs.push(<MessageContainer message={err} isUser={false} isFirst={isFirst}/>);
                  this.setState({msgQueue: msgs});
              });
              return
          }
          msgs.push(msg);


      this.setState({msgQueue: msgs, shouldUpdate: false});
  }

  generateBotResponse(key, isFirst, message) {
      let msgObject = this.state.msgMap.get(key);

      if(msgObject) {
          let userNext = msgObject.userNext;

          if(msgObject.message) {
              let msgType = typeof msgObject.message;
              if ( msgType === "string") {
                  return <MessageContainer message={msgObject.message} isUser={false} isFirst={isFirst}/>
              } else if (msgType === "function") {
                  let val = msgObject.message(message);
                  console.log(msgObject.message);
                  console.log(val);
                  return <MessageContainer message={val} isUser={false} isFirst={isFirst}/>
              } else if (msgObject.message.then) {
                  return msgObject.message;
              }

              console.log(msgObject);
              return <MessageContainer message={"Oops, something wrong happened"} isUser={false} isFirst={isFirst}/>
          } else {
              return (<MessageContainer messageComponent={msgObject.messageComponent} isUser={false} isFirst={isFirst}/>);
          }
      }
  }

  getNextStep() {

  }

  render() {
    return (
      <div className="App">
        <ChatContainer>
          <ChatHeader/>
          <ChatContent>
              {this.state.msgQueue}
          </ChatContent>
          <ChatFooter captureUserInput={this.captureUserInput}/>
        </ChatContainer>
      </div>
    );
  }
}

export default App;
