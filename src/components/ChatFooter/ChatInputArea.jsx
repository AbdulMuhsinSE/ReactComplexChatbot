import React, {Component} from "react";
import styles from "./ChatFooter.module.scss";

function autoExpand (event) {
    let field = event.target;

    //field.style.height = "inherit";
    field.style.height = 20 + "px";

    let computed = window.getComputedStyle(field);

    let newHeight = parseInt(computed.getPropertyValue("border-top-width"), 10) +
        parseInt(computed.getPropertyValue("padding-top"), 10) +
        field.scrollHeight +
        parseInt(computed.getPropertyValue("padding-bottom"),10) +
        parseInt(computed.getPropertyValue("border-bottom-width"),10);

    field.style.height = (newHeight > 90) ? 90 + "px" : newHeight + "px";
}

class ChatInputArea extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: (this.props.inputVal) ? this.props.inputVal : "",
            placeholder: props.placeholder ? props.placeholder : "Type a message",
            className: ""
        };
        this.handleInput = this.handleInput.bind(this);
    }

    static getDerivedStateFromProps(props, prevState){
        if(props.placeholder !== prevState.placeholder) {
            return {placeholder: props.placeholder, className: props.className, value: props.inputVal};
        }
        if(props.inputVal !== prevState.value) {
            return {value: props.inputVal};
        }
        return null;
    }

    handleInput(event) {
        this.setState({value: event.target.value});

        if(this.props.handleInput != null) {
            this.props.handleInput(event);
        }

        autoExpand(event);
    }

    render() {
        return (
            <div className={styles["user-input-div"] + " " + this.state.className}>
                <textarea placeholder={this.state.placeholder} id={"message"} className={styles["user-input-textarea"]} value={this.state.value} onChange={this.handleInput}/>
            </div>
        );
    }



}

export default ChatInputArea;