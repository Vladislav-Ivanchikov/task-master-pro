import React from "react";
import styles from "./TextArea.module.css";
export const TextArea = ({ label, placeholder, value, onChange, disabled = false, error, rows = 4, className = "", style, }) => {
    const textareaClass = [
        styles.textarea,
        error ? styles.error : "",
        disabled ? styles.disabled : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");
    return (React.createElement("div", { className: styles.wrapper, style: style },
        label && React.createElement("label", { className: styles.label }, label),
        React.createElement("textarea", { className: textareaClass, placeholder: placeholder, value: value, onChange: onChange, disabled: disabled, rows: rows }),
        error && React.createElement("div", { className: styles.errorMessage }, error)));
};
