import React, {Component} from "react";
import styles from "./ChatContent.module.scss";
import Bubble from "./Bubble";
import {Edit} from "../../icons/icons";

class MessageContainer extends Component {
    constructor(props) {
        super(props);
        let message = props.message ? props.message :"Your content goes here";
        let extra = props.extraComponent;

        if (props.canEdit && !extra) {
            extra = <div className={styles["edit-icon"]}> <Edit onClick={this.changeMessage.bind(this, "what?")}/> </div>;
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

        this.state.messageComponent = props.messageComponent ;
    }

    static defaultProps = {
        className: "",
        extraComponent: null,
        avatarComponent: <img style={{height: "100%", width:"100%"}} src={"/favicon.ico"} alt={""}/>,
        showAvatar: true,
        isUser: true,
        isFirst: false,
        isLast: false,
        avatarHeight: "35px",
        avatarWidth: "35px",
        canEdit: false,
    };

    static getDerivedStateFromProps(props, state) {
        let newState ={};
        if(props.message !== state.message) newState.message = props.message;
        return newState;
    }

    changeMessage(newMsg) {
        if(this.props.changeMessage) {
            this.props.changeMessage(newMsg,this.state.index);
        }
    }

    render() {
        const messageComponent = (!this.state.messageComponent) ?
            <Bubble isUser={this.state.isUser} message={this.state.message} isFirst={this.state.isFirst} showAvatar={this.state.showAvatar}/>
            :
            this.state.messageComponent;
        const components = [<div className={styles.avatar}>{this.state.avatarComponent}</div>, messageComponent, this.state.extraComponent];
        if(!this.state.showAvatar) {
            components.shift();
        }
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