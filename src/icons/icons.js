import React from "react";
import {withBaseIcon} from "react-icons-kit";
import {pen_2} from "react-icons-kit/ikons/pen_2";

const IconContainer = withBaseIcon({size: 20, style:{color: "#2C8AAA"}});
export const Edit = (props) => <IconContainer onClick={props.onClick} icon={pen_2}/>;