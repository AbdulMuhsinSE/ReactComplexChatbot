import React, {Component} from "react";
import styles from "./ChatContent.module.scss";
import Bubble from "./Bubble";
import {Edit} from "../../icons/icons";
import cn from "classnames";

class MessageContainer extends Component {
    constructor(props) {
        super(props);
        let message = props.message ? props.message :"Your content goes here";
        let extra = props.extraComponent;
        this.state={
            isEditing: false
        };

        this.state = {
            isEditing: this.state.isEditing,
            avatarComponent: props.isFirst ? props.avatarComponent : null,
            showAvatar: props.showAvatar,
            message: message,
            isUser: props.isUser,
            extraComponent: null,
            containerClassName: props.isUser ? styles["user-message-container"] : styles["bot-message-container"],
            firstContainerClassName:props.isFirst ? styles["first-container"]: "",
            customContainerClass: props.className,
            isFirst: props.isFirst,
            index: props.index,
        };

    }

    handleChange(event) {
        let sentence = event.target.value;

        if(sentence.length === 0) {
            alert("Cannot have an empty message");
            return;
        }

        this.setState({
            message : sentence,
        });

        if(this.props.changeMessage) {
            this.props.changeMessage(sentence, this.state.index);
        }
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

    changeMessage() {
        this.setState({
            isEditing : !this.state.isEditing
        });
    }


    render() {
        let messageComponent;

        let extra = [];

        if (this.props.canEdit) {
            extra = [<div className={cn({hide : !this.state.isEditing})}><textarea rows={3} value={this.state.message} onChange={this.handleChange.bind(this)}/> </div>,<div key={3} className={styles["edit-icon"] + " tooltip-container" }> <Edit onClick={this.changeMessage.bind(this, this.state.message)}/> <span className={"tooltip-left"}>Edit</span> </div>];
        }

        if(this.state.messageComponent != null) {
            messageComponent = this.state.messageComponent;
        } else {
                messageComponent =
                    <Bubble key={1} isUser={this.state.isUser} message={this.state.message} isFirst={this.state.isFirst}
                            showAvatar={this.state.showAvatar} userContentClass={cn({hide : this.state.isEditing})}/>;
        }

        const components = [<div key={0} className={styles.avatar}>{this.state.avatarComponent}</div>, messageComponent, ...extra];

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