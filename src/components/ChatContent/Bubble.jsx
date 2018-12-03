import React, {Component} from "react";
import styles from "./ChatContent.module.scss";

class Bubble extends Component {

    constructor(props) {
        super(props);

        const {isUser, showAvatar, isFirst, isLast} = props;
        const firstMargin = "0 0 10px 0";

        let calculatedMargin;
        if(showAvatar) {
            calculatedMargin = isUser ? "-8px 46px 10px 0" : "-8px 0 10px 46px";
        } else {
            calculatedMargin = isUser ? "-8px 0px 10px 0" : "-8px 0 10px 0px";
        }

        let addedClass= "";
        if(isUser) {
            if(isFirst) {
                addedClass= styles["user-first"]
            } else if(isLast){
                addedClass= styles["user-last"]
            }
        } else {
            if(isFirst) {
                addedClass= styles["bot-first"]
            } else if(isLast) {
                addedClass= styles["bot-last"]
            }
        }

        this.state = {
            message: props.message,
            showAvatar: showAvatar,
            isUser: isUser,
            chatBubbleStyle: (isUser) ? props.userBubbleStyle : props.botBubbleStyle,
            chatContentStyle: (isUser) ? props.userContentStyle : props.botContentStyle,
            margin: props.isFirst ? firstMargin : calculatedMargin,
            bubbleClass: (isUser) ? styles.userBubble : styles.botBubble,
            userContentClass: props.userContentClass,
            addedClass: addedClass
        }
    }

    static defaultProps = {
        message: "Your content goes here",
        showAvatar: true,
        isUser: false,
        userBubbleStyle: {},
        botBubbleStyle: {},
        isFirst: false,
        isLast: false
    };

    static getDerivedStateFromProps(props, state) {
        console.log(props);
        if(props.message && (state.message !== props.message)) {
            return {message: props.message, userContentClass: props.userContentClass}
        }
        if (props.userContentClass !== state.userContentClass) {
            return {userContentClass : props.userContentClass}
        }
        return {};
    }


    render() {
        return (
          <div className={this.state.bubbleClass +" "+  this.state.addedClass + " " + this.state.userContentClass} style={this.state.chatBubbleStyle}>
              {this.state.message}
          </div>
        );
    }

}

export default Bubble;