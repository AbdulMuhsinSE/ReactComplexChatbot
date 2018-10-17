import React, {Component} from "react";
import styles from "./ChatContent.module.scss";
import Bubble from "./Bubble";

class MessageContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            avatarComponent: props.avatarComponent,
            showAvatar: props.showAvatar,
            isUser: props.isUser,
            messageComponent: props.messageComponent ? props.messageComponent : <Bubble isUser={props.isUser} isFirst={props.isFirst} showAvatar={props.showAvatar}/>,
            extraComponent: props.extra,
            containerClassName: props.isUser ? styles["user-message-container"] : styles["bot-message-container"],
            customContainerClass: props.className
        }
    }

    static defaultProps = {
        className: "",
        extraComponent: null,
        avatarComponent: null,
        showAvatar: false,
        isUser: true,
        isFirst: false,
        isLast: false
    };

    render() {
        const components = [this.state.avatarComponent, this.state.messageComponent, this.state.extraComponent];

        return(
            <div className={this.state.containerClassName + this.state.customContainerClass}>
                {components.filter(Boolean)}
            </div>
        )
    }

}

export default MessageContainer