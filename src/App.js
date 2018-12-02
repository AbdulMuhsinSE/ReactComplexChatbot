import React, {Component} from 'react';
import './App.scss';
import styles from "./App.module.scss"
import {ChatHeader} from "./components/index";
import MessageContainer from "./components/ChatContent/MessageContainer";
import ChatContainer from "./components/ChatContainer/ChatContainer";
import ChatContent from "./components/ChatContent/ChatContent";
import ChatFooter from "./components/ChatFooter/ChatFooter";
import {Warning} from "./icons/icons";


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            msgQueue: [{message:<p>Hi Aiva Here, I am so in love with yousef! He is my knight in shining armor. I wish he would love me back</p>, isUser:false, isFirst:true}],
            msgMap: new Map(),
            stepCounter: 0,
            parent: null,
            showAlert: ""
        };

        this.captureUserInput = this.captureUserInput.bind(this);
        this.redoLastBotInteraction = this.redoLastBotInteraction.bind(this);
        this.changeMessage = this.changeMessage.bind(this);
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
            if (lastmsg.isUser !== null && lastmsg.isUser !== undefined && !lastmsg.isUser) {
                parent = lastmsg;
                break;
            }
            lastmsg = msgs[--revCounter];
        }

        msgs.push({message:message, isUser:true, isFirst:isFirst, canEdit:canEdit, changeMessage: this.changeMessage});

        this.setState({msgQueue: msgs, parent: parent});
        this.handleResponse(message);
    }

    changeMessage(message, index) {
        let msgQueue = this.state.msgQueue;
        //console.log(msgQueue);

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

        let msg = this.generateBotResponse("q_detected", isFirst, message);
        if (msg && msg.message && msg.message.then && typeof msg.message.then === "function") {
            msg.message(message).then(result => {
                msgs.push({message:result, isUser:false, isFirst:isFirst});
                this.setState({msgQueue: msgs});
            }).catch(err => {
                msgs.push({message:err, isUser:false, isFirst:isFirst});
                this.setState({msgQueue: msgs});
            });
            return
        }
        msgs.push(msg);

        this.setState({
            msgQueue: msgs,
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
                    return {message:msgObject.message, isUser:false, isFirst:isFirst};
                } else if (msgType === "function") {
                    let val = msgObject.message(message);
                    return {message:val, isUser:false, isFirst:isFirst};
                } else if (msgObject.message.then) {
                    return msgObject.message;
                }

                return {message:"Oops, something wrong happened", isUser:false, isFirst:isFirst};
            } else {
                return {messageComponent:msgObject.messageComponent, isUser:false, isFirst:isFirst};
            }
        }
        return {message:"Oops, something wrong happened. Please inform the chatbot developer", isUser:false, isFirst:isFirst};
    }

    redoLastBotInteraction() {
        let msgs = this.state.msgQueue;
        const currIndex = msgs.length;
        if (this.state.parent) {
            if (this.state.parent === msgs[msgs.length - 1]) {
                this.setState({showAlert: styles["show"], alertMessage:"The undo button allows access to only a single level above"});
                return;
            }
            else msgs.push(this.state.parent);
        } else {
            this.setState({showAlert: styles["show"], alertMessage:"Access to the previous element is unavailable or not allowed."});
            return;
        }

        this.setState({
            msgQueue: msgs
        });
    }

    close() {
        this.setState({
            showAlert: ""
        });
    }

    render() {
        let msgQueue = this.state.msgQueue;
        return (
            <div className="App">
                <ChatContainer>
                    <ChatHeader/>
                    <ChatContent>
                        {msgQueue.map((element, index) => {
                            console.log(index, element);
                            if(element.message){
                                return <MessageContainer key={index} index={index} message={element.message} isUser={element.isUser} showAvatar={(element.showAvatar !== undefined && element.showAvatar !== null) ? element.showAvatar : true} isFirst={element.isFirst} canEdit={element.canEdit} changeMessage={this.changeMessage}/>
                            } else if(element.messageComponent) {
                                return <MessageContainer key={index} messageComponent={element.messageComponent} showAvatar={(element.showAvatar !== undefined && element.showAvatar !== null) ? element.showAvatar : true} isFirst={(element.isFirst !== null && element.isFirst !== undefined)? element.isFirst : true} isUser={(element.isUser !== null && element.isUser !== undefined)? element.isUser : true }/>
                            }
                            return null;
                        })}
                    </ChatContent>
                    <ChatFooter captureUserInput={this.captureUserInput} redo={this.redoLastBotInteraction}/>
                    <div onClick={this.close.bind(this)} className={styles["alert-div-warning"] + " " + this.state.showAlert}>
                        <Warning/><h5>{this.state.alertMessage}</h5>
                    </div>
                </ChatContainer>
            </div>
        );
    }
}

export default App;
