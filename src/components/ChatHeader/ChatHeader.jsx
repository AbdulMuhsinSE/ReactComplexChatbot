import React, {Component} from "react";
import styles from "./ChatHeader.module.scss";

const logo = <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                  width="45px" height="45px" viewBox="0 0 1807.000000 1807.000000"
                  preserveAspectRatio="xMidYMid meet">

    <g transform="translate(0.000000,1807.000000) scale(0.100000,-0.100000)"
       fill="#fff" stroke="none">
        <path d="M5007 12072 c-548 -548 -997 -1003 -997 -1010 0 -9 209 -12 1008 -12
l1007 0 998 998 c548 548 997 1003 997 1010 0 9 -209 12 -1008 12 l-1007 0
-998 -998z"/>
        <path d="M9007 12078 l-989 -993 1 -3729 c1 -2050 4 -3732 7 -3737 3 -5 14 -9
24 -9 11 0 320 303 799 783 430 430 785 787 791 792 5 6 61 61 122 123 62 63
121 121 132 130 10 10 45 44 77 76 l59 59 0 2739 0 2738 978 0 977 0 998 998
c548 548 997 1003 997 1010 0 9 -407 12 -1992 12 l-1991 0 -990 -992z"/>
    </g>
</svg>;

class ChatHeader extends Component {

    constructor(props) {
        super(props);

        this.state = {
            style: props.style,
            className: props.className
        }
    }

    static defaultProps = {
        style: {},
        className: "",
        headerTitle: "React Complex Chatbot"
    };

    render() {
        return (
            <div className={styles.container + this.props.className} style={this.state.style}>
                <div className={styles.fadeOut} style={{height: "42px", width: "42px"}}>
                    {logo}
                </div>
                <h2 className={styles.fadeIn}>{this.props.headerTitle}</h2>
            </div>
        );
    }
}

export default ChatHeader;