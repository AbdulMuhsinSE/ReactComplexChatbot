import React, {Component} from "react";
import styles from "./ChatContent.module.scss";
import Bubble from "./Bubble";

class MessageContainer extends Component {
    constructor(props) {
        super(props);
        let message = props.message ? props.message :"Your content goes here";
        this.state = {
            avatarComponent: props.isFirst ? props.avatarComponent : null,
            showAvatar: props.showAvatar,
            isUser: props.isUser,
            messageComponent: props.messageComponent ? props.messageComponent : <Bubble isUser={props.isUser} message={message} isFirst={props.isFirst} showAvatar={props.showAvatar}/>,
            extraComponent: props.extra,
            containerClassName: props.isUser ? styles["user-message-container"] : styles["bot-message-container"],
            firstContainerClassName:props.isFirst ? styles["first-container"]: "",
            customContainerClass: props.className
        }
    }

    static defaultProps = {
        className: "",
        extraComponent: null,
        avatarComponent: <img style={{height: "100%", width:"100%"}} src={"/favicon.ico"} alt={""}/>,
        showAvatar: false,
        isUser: true,
        isFirst: false,
        isLast: false,
        avatarHeight: "35px",
        avatarWidth: "35px"
    };

    render() {
        const components = [<div className={styles.avatar}>{this.state.avatarComponent}</div>, this.state.messageComponent, this.state.extraComponent];
        if(this.state.isUser){
            components.reverse();
        }
        return(
            <div className={this.state.containerClassName +" "+ this.state.firstContainerClassName + " " + this.state.customContainerClass}>
                {components.filter(Boolean)}
            </div>
        )
    }

}

export default MessageContainer