import React, {Component} from 'react';
import './App.scss';
import styles from "./App.module.scss"
import {ChatHeader} from "./components/index";
import MessageContainer from "./components/ChatContent/MessageContainer";
import ChatContainer from "./components/ChatContainer/ChatContainer";
import ChatContent from "./components/ChatContent/ChatContent";
import ChatFooter from "./components/ChatFooter/ChatFooter";


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            msgQueue: [<MessageContainer key={0}
                                         message={<p>Can we go to the park? Can we, can we, can we.... PUHLEEEHi Aiva
                                             Here, I am so in love with yousef! He is my knight in shining armor. I wish
                                             he would love me back</p>} isUser={false} isFirst={true}/>],
            msgMap: new Map(),
            stepCounter: 0,
            parent: null,
        };

        this.captureUserInput = this.captureUserInput.bind(this);
        this.redoLastBotInteraction = this.redoLastBotInteraction.bind(this);
    }

    componentDidMount() {
        this.loadInitialMsgMap();
    }

    loadInitialMsgMap() {
        let msgMap = this.state.msgMap;
    }

    captureUserInput(message) {
        let msgs = this.state.msgQueue;
        let revCounter = msgs.length - 1;
        let lastmsg = msgs[revCounter];
        let parent = null;
        let isFirst = true;
        let canEdit = true;


        if (lastmsg) {
            isFirst = (!lastmsg.props.isUser);
        }

        while (revCounter >= 0) {
            if (lastmsg.props && !lastmsg.props.isUser) {
                parent = lastmsg;
                break;
            }
            lastmsg = msgs[--revCounter];
        }

        msgs.push(<MessageContainer key={msgs.length} message={message} isUser={true} isFirst={isFirst}
                                    canEdit={canEdit}/>);

        console.log(parent);
        this.setState({msgQueue: msgs, shouldUpdate: false, parent: parent});
        this.handleResponse(message);
    }

    changeMessage(message, index) {
        let msgQueue = this.state.msgQueue;
        msgQueue[index].props.message = message;
    }

    handleResponse(message) {
        //TODO: Add response handler
        let msgs = this.state.msgQueue;
        let time = Math.floor(message.length / 10) * 100;

        time = (time > 750) ? ((time > 3000) ? 2000 : time) : 750;
        setTimeout(this.botRespond.bind(this, message), time);

        console.log(this.state);

        this.setState({
            msgQueue: msgs
        });
    }

    botRespond(message) {
        let msgs = this.state.msgQueue;
        let lastmsg = msgs[msgs.length - 1];
        let isFirst = true;
        let q_detected = true;

        if (lastmsg) {
            isFirst = (lastmsg.props.isUser !== false);
        }

        let msg = this.generateBotResponse("q_detected", isFirst, message);
        if (msg && msg.message && msg.message.then && typeof msg.message.then === "function") {
            msg.message(message).then(result => {
                msgs.push(<MessageContainer key={msgs.length} message={result} isUser={false} isFirst={isFirst}/>);
                this.setState({msgQueue: msgs});
            }).catch(err => {
                msgs.push(<MessageContainer key={msgs.length} message={err} isUser={false} isFirst={isFirst}/>);
                this.setState({msgQueue: msgs});
            });
            return
        }
        msgs.push(msg);

        this.setState({
            msgQueue: msgs,
            shouldUpdate: false
        });
    }

    generateBotResponse(key, isFirst, message) {
        let msgObject = this.state.msgMap.get(key);
        let msgs = {};
        msgs.length = this.state.msgQueue.length;

        if (msgObject) {
            let userNext = msgObject.userNext;

            if (msgObject.message) {
                let msgType = typeof msgObject.message;
                if (msgType === "string") {
                    return <MessageContainer key={msgs.length} message={msgObject.message} isUser={false}
                                             isFirst={isFirst}/>
                } else if (msgType === "function") {
                    let val = msgObject.message(message);
                    console.log(msgObject.message);
                    console.log(val);
                    return <MessageContainer key={msgs.length} message={val} isUser={false} isFirst={isFirst}/>
                } else if (msgObject.message.then) {
                    return msgObject.message;
                }

                return <MessageContainer key={msgs.length} message={"Oops, something wrong happened"} isUser={false}
                                         isFirst={isFirst}/>
            } else {
                return (<MessageContainer key={msgs.length} messageComponent={msgObject.messageComponent} isUser={false}
                                          isFirst={isFirst}/>);
            }
        }
        return <MessageContainer key={msgs.length}
                                 message={"Oops, something wrong happened. Please inform the chatbot developer."}
                                 isUser={false} isFirst={isFirst}/>
    }

    redoLastBotInteraction() {
        console.log(this.state.msgQueue);
        let msgs = this.state.msgQueue;
        const currIndex = msgs.length;
        if (this.state.parent) {
            if (this.state.parent === msgs[msgs.length - 1]) msgs.push(<MessageContainer key={msgs.length}
                                                                                         showAvatar={false}
                                                                                         messageComponent={<div
                                                                                             onClick={this.removeMsgAtPosition.bind(this, currIndex)}
                                                                                             className={styles["alert-div-info"]}>
                                                                                             <h5>The undo button allows
                                                                                                 access to only a single
                                                                                                 level above</h5>
                                                                                         </div>}/>);
            else msgs.push(this.state.parent);
        } else {
            msgs.push(<MessageContainer key={msgs.length} showAvatar={false}
                                        messageComponent={<div onClick={this.removeMsgAtPosition.bind(this, currIndex)}
                                                               className={styles["alert-div-warning"]}><h5>Oops, access
                                            to the previous bot interaction is denied or unavailable</h5></div>}/>);
        }

        this.setState({
            msgQueue: msgs
        });
    }

    removeMsgAtPosition(index) {
        let msgs = this.state.msgQueue;

        console.log(index);
        console.log(msgs[index]);

        if (index < msgs.length) {
            msgs.splice(index, 1, "");
        }

        console.log(msgs[index]);

        this.setState({
            msgQueue: msgs
        });
    }

    render() {
        return (
            <div className="App">
                <ChatContainer>
                    <ChatHeader/>
                    <ChatContent>
                        {this.state.msgQueue}
                    </ChatContent>
                    <ChatFooter captureUserInput={this.captureUserInput} redo={this.redoLastBotInteraction}/>
                </ChatContainer>
            </div>
        );
    }
}

export default App;
