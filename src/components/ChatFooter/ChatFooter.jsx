import React, {Component} from "react";
import ChatInputArea from "./ChatInputArea";
import styles from "./ChatFooter.module.scss";
import undo from "./arrows.svg";
import send from "./send.svg";


class ChatFooter extends Component {

    constructor(props) {
        super(props);

        this.state = {
            inputVal: "",
            placeholder: "Type a message",
            inputAreaClass: "",
        };


        this.previousNode = this.previousNode.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.send = this.send.bind(this);
    }

    previousNode(event) {
        if(this.props.redo) {
            this.props.redo();
            return;
        }
        alert("No redo event has been defined by the chatbot provider");
    }

    handleInput(event) {
        this.setState({inputVal: event.target.value});
    }

    send(event) {
        let input = this.state.inputVal;

        if(input.trim() === "" || !input) {
            this.setState({
                inputVal:"",
                placeholder: "Please write a message first...",
                inputAreaClass: styles["red-outline"],
            });
            return
        }

        this.setState({
            inputVal: "",
            placeholder: "Type a message",
            inputAreaClass: ""
        });

        if(this.props.captureUserInput) {
            this.props.captureUserInput(input);
        }

    };


    render() {
        let toAdd;

        if(this.props.children) {
            toAdd = this.props.children;
        } else {
            toAdd = [<ChatInputArea className={this.state.inputAreaClass} inputVal={this.state.inputVal} placeholder={this.state.placeholder} handleInput={this.handleInput}/>]
        }

        return(
            <div className={styles["footer-div"]}>
                <span className={"tooltip-container"} style={{height: "40px", width: "40px"}}>
                    <img onClick={this.previousNode} src={undo} className={styles.ripple}/>
                    <span className={"tooltip-right"}>Previous Interaction</span>
                </span>
                {toAdd}
                <span className={"tooltip-container"} style={{height: "40px", width: "40px"}}>
                    <img onClick={this.send} src={send} className={styles.ripple}/>
                    <span className={"tooltip-left"}>Send Message</span>
                </span>
            </div>
        )
    }
}

export default ChatFooter