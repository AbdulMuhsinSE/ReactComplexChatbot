import React, {Component} from "react";
import styles from "./ChatContainer.module.scss";

class ChatContainer extends Component{

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

    render() {
        return(
            <div className={styles.container + this.props.className} style={this.state.style}>
                {this.props.children}
            </div>
        );
    }

}

export default ChatContainer;