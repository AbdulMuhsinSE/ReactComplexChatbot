import React, {Component} from "react";
import styles from "./ChatContent.module.scss";
import Bubble from "./Bubble";
import {Edit} from "../../icons/icons";

class MessageContainer extends Component {
    constructor(props) {
        super(props);
        let message = props.message ? props.message :"Your content goes here";
        let extra = props.extraComponent;

        if (props.canEdit) {
            extra = <div key={2} className={styles["edit-icon"] + " tooltip-container"}> <Edit onClick={this.changeMessage.bind(this, "what?")}/> <span className={"tooltip-left"}>Edit</span> </div>;
        }

        this.state = {
            avatarComponent: props.isFirst ? props.avatarComponent : null,
            showAvatar: props.showAvatar,
            message: message,
            isUser: props.isUser,
            extraComponent: extra,
            containerClassName: props.isUser ? styles["user-message-container"] : styles["bot-message-container"],
            firstContainerClassName:props.isFirst ? styles["first-container"]: "",
            customContainerClass: props.className,
            isFirst: props.isFirst,
            index: props.index
        };

    }

    static getDerivedStateFromProps(props, state) {
        return props;
    }

    static defaultProps = {
        className: "",
        avatarComponent: <img style={{height: "100%", width:"100%"}} src={"/favicon.ico"} alt={""}/>,
        showAvatar: true,
        isUser: true,
        isFirst: false,
        isLast: false,
        avatarHeight: "35px",
        avatarWidth: "35px",
        canEdit: false,
    };

    changeMessage(newMsg) {
        if(this.props.changeMessage) {
            this.props.changeMessage(newMsg, this.state.index);
        }
    }

    render() {
        let messageComponent;

        if(this.state.messageComponent != null) {
            messageComponent = this.state.messageComponent;
        } else {
            messageComponent = <Bubble key={1} isUser={this.state.isUser} message={this.state.message} isFirst={this.state.isFirst} showAvatar={this.state.showAvatar}/>;
        }

        const components = [<div key={0} className={styles.avatar}>{this.state.avatarComponent}</div>, messageComponent, this.state.extraComponent];
        if(!this.state.showAvatar) {
            components.shift();
        }
        if(this.state.isUser){
            components.reverse();
        }
        return(
            <div className={this.state.containerClassName +" "+ this.state.firstContainerClassName + " " + this.state.customContainerClass}>
                {components}
            </div>
        )
    }

}

export default MessageContainer