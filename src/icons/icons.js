import React from "react";
import {withBaseIcon} from "react-icons-kit";
import {pen_2} from "react-icons-kit/ikons/pen_2";
import {block} from "react-icons-kit/ikons/block";

const IconContainer = withBaseIcon({size: 20, style:{color: "#2C8AAA"}});
export const Edit = (props) => <IconContainer onClick={props.onClick} icon={pen_2}/>;
export const Warning = (props) => <IconContainer style={{marginLeft:"5px", color: "#edb200"}} onClick={props.onClick} icon={block}/>;