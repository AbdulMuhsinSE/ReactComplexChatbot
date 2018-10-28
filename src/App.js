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
            msgQueue: [{messageComponent:<p>Can we go to the park? Can we, can we, can we.... PUHLEEEHi Aiva
                                             Here, I am so in love with yousef! He is my knight in shining armor. I wish
                                             he would love me back</p>, isUser: false, isFirst: true}],
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
            isFirst = (!lastmsg.isUser);
        }

        while (revCounter >= 0) {
            if (lastmsg && !lastmsg.isUser) {
                parent = lastmsg;
                break;
            }
            lastmsg = msgs[--revCounter];
        }

        msgs.push({message: message, isUser:true, isFirst:isFirst, canEdit: canEdit, changeMessage: this.changeMessage.bind(this)});

        console.log(parent);

        this.setState({msgQueue: msgs, shouldUpdate: false, parent: parent});
        this.handleResponse(message);
    }

    changeMessage(message, index) {
        let msgQueue = this.state.msgQueue;
        msgQueue[index].message = message;
        this.setState({
            msgQueue: msgQueue
        });
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
        let lastmsg = msgs[msgs.length - 1];
        let isFirst = true;
        let q_detected = true;

        if (lastmsg) {
            isFirst = (lastmsg.isUser !== false);
        }

        let resultObject = {isUser: false, isFirst: isFirst};
        let msg = this.generateBotResponse("q_detected", isFirst, message);

        if(typeof message === "string") {
            resultObject.message = msg;
        } else if (msg && msg.message && msg.message.then && typeof msg.message.then === "function") {
            msg.message(message).then(result => {
                resultObject.message = result;
            }).catch(err => {
                resultObject.message = err;
            });
            return
        } else {
            resultObject.messageComponent = msg;
        }

        msgs.push(resultObject);

        this.setState({
            msgQueue: msgs,
            shouldUpdate: false
        });
    }

    generateBotResponse(key, isFirst, message) {
        let msgObject = this.state.msgMap.get(key);
        let finalMessage;

        if (msgObject) {
            if (msgObject.message) {
                let msgType = typeof msgObject.message;
                if (msgType === "string") {
                    finalMessage = msgObject.message;
                } else if (msgType === "function") {
                    finalMessage = msgObject.message(message);
                } else if (msgObject.message.then) {
                    //needs extra processing
                    return msgObject.message;
                }
            } else {
                finalMessage = msgObject.messageComponent;
            }
        }

        if(!finalMessage) {finalMessage = "Oops, something wrong happened. Please inform the dev team."}
        return finalMessage;
    }

    redoLastBotInteraction() {
        let msgs = this.state.msgQueue;
        const currIndex = msgs.length;
        if (this.state.parent) {
            if (this.state.parent === msgs[msgs.length - 1]) {
                msgs.push({
                    showAvatar:false,
                    isUser: true,
                    messageComponent:
                        <div onClick={this.removeMsgAtPosition.bind(this, currIndex)}
                        className={styles["alert-div-info"]}>
                            <h5>The undo button allows access to only a single level above</h5>
                        </div>
                });
            }
            else msgs.push(this.state.parent);
        } else {
            msgs.push({
                showAvatar:false,
                isUser: true,
                messageComponent:
                    <div onClick={this.removeMsgAtPosition.bind(this, currIndex)}
                         className={styles["alert-div-warning"]}>
                        <h5>Oops, access to the previous bot interaction is denied or unavailable</h5>
                    </div>
            });
        }

        this.setState({
            msgQueue: msgs
        });
    }

    removeMsgAtPosition(index) {
        let msgs = this.state.msgQueue;

        if (index < msgs.length) {
            delete msgs[index];
        }

        this.setState({
            msgQueue: msgs
        });
    }

    render() {
        let messages = this.state.msgQueue.map((msgObject, index) => {
            if(msgObject) {
                msgObject.key = index;
                return React.cloneElement(<MessageContainer index={index}/>, msgObject);
            }
        });
        return (
            <div className="App">
                <ChatContainer>
                    <ChatHeader/>
                    <ChatContent>
                        {messages}
                    </ChatContent>
                    <ChatFooter captureUserInput={this.captureUserInput} redo={this.redoLastBotInteraction}/>
                </ChatContainer>
            </div>
        );
    }
}

export default App;
