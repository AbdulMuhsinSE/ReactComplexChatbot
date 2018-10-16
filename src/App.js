import React, { Component } from 'react';
import logo from './logo.svg';
import './App.scss';
import {ChatHeader} from "./components/index";
import MessageContainer from "./components/ChatContent/MessageContainer";


class App extends Component {
  render() {
    return (
      <div className="App">
          <ChatHeader/>
        <MessageContainer/>
      </div>
    );
  }
}

export default App;
