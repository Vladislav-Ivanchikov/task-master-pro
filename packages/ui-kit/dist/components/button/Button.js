import React from "react";
import classes from "./Button.module.css";
export const Button = ({ variant = "primary", onClick, disabled = false, children, }) => {
    const className = `${classes.button} button-${variant}${disabled ? " button-disabled" : ""}`;
    return (React.createElement("button", { className: className, onClick: onClick, disabled: disabled }, children));
};
