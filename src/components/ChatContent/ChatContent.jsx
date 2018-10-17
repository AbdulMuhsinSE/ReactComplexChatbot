import React, {Component} from "react";
import styles from "./ChatContent.module.scss";

class ChatContent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            style: props.style,
            className: props.className
        }
    }

    static defaultProps = {
        style: {},
        className: ""
    };

    scrollToBottom() {
        this.messagesEnd.scrollIntoView({behavior: "smooth"});
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    render() {
        return(
            <div className={styles.container + " " + this.props.className} style={this.state.style}>
                <div>
                {this.props.children}
                </div>
                <div className={styles["is-typing"]} ref={(e) => this.messagesEnd = e}/>
            </div>
        );
    }
}

export default ChatContent;