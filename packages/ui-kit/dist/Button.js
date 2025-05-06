import React from "react";
export const Button = ({ variant = "primary", onClick, disabled = false, children, }) => {
    const className = `button button-${variant}${disabled ? " button-disabled" : ""}`;
    return (React.createElement("button", { className: className, onClick: onClick, disabled: disabled }, children));
};
