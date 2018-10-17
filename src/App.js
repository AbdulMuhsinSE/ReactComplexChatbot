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
      msgQueue: [],
        shouldUpdate: true,
    }
  }

  loadNewQuestion(bool) {
    console.log(this.state.msgQueue);
    let msgs = this.state.msgQueue;
    msgs.push(<MessageContainer isUser={true} isFirst={true}/>);
    this.setState({msgQueue: msgs, shouldUpdate: false});
  }

  totallyUpdate(){
    this.setState({
        shouldUpdate: true
    });
  }

  render() {
    if(this.state.shouldUpdate) {
        console.log("ummmm....");
        console.log(this.state.msgQueue);
        this.loadNewQuestion(true);
    }
    return (
      <div className="App">
        <ChatContainer>
          <ChatHeader/>
          <ChatContent>
              {this.state.msgQueue}
          </ChatContent>
        </ChatContainer>
        <button onClick={this.totallyUpdate.bind(this)}>ADD ONE ADD ONE</button>
      </div>
    );
  }
}

export default App;
