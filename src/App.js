import React, { Component } from 'react';
import logo from './logo.svg';
import './App.scss';
import {ChatHeader} from "./components/index";
import MessageContainer from "./components/ChatContent/MessageContainer";
import ChatContainer from "./components/ChatContainer/ChatContainer";
import ChatContent from "./components/ChatContent/ChatContent";



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msgQueue: [<MessageContainer message={<p>Can we go to the park? Can we, can we, can we.... PUHLEEEHi Aiva Here, I am so in love with yousef! He is my knight in shining armor. I wish he would love me back</p>} isUser={false} isFirst={true}/>],
        shouldUpdate: true,
        user: true
    }
  }

  loadNewQuestion(bool) {
    console.log(bool)
    let msgs = this.state.msgQueue;
    let lastmsg = msgs[msgs.length-1];
    let isFirst = true;
    if(lastmsg) {
      isFirst = (lastmsg.props.isUser !== bool);
    }
    msgs.push(<MessageContainer isUser={bool} isFirst={isFirst}/>);
    this.setState({msgQueue: msgs, shouldUpdate: false});
  }

  totallyUpdate(bool){
    this.setState({
        shouldUpdate: true,
        user: bool
    });
  }

  render() {
    if(this.state.shouldUpdate) {
        console.log("ummmm....");
        console.log(this.state.msgQueue);
        this.loadNewQuestion(this.state.user);
    }
    return (
      <div className="App">
        <ChatContainer>
          <ChatHeader/>
          <ChatContent>
              {this.state.msgQueue}
          </ChatContent>
        </ChatContainer>
          <button onClick={this.totallyUpdate.bind(this, true)}>ADD ONE FROM USER</button>
          <button onClick={this.totallyUpdate.bind(this, false)}>ADD ONE FROM BOT</button>
      </div>
    );
  }
}

export default App;
