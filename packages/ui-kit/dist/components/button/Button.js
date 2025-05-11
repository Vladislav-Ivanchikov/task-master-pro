import React from "react";
import styles from "./Button.module.css";
export const Button = ({ children, variant = "primary", size = "medium", onClick, disabled = false, loading = false, iconLeft, iconRight, }) => {
    const className = [
        styles.button,
        styles[variant],
        styles[size],
        loading ? styles.loading : "",
        disabled ? styles.disabled : "",
    ]
        .filter(Boolean)
        .join(" ");
    return (React.createElement("button", { className: className, onClick: onClick, disabled: disabled || loading, type: "button" }, loading ? ("Загруз...") : (React.createElement(React.Fragment, null,
        iconLeft && React.createElement("span", { className: styles.icon }, iconLeft),
        children,
        iconRight && React.createElement("span", { className: styles.icon }, iconRight)))));
};
