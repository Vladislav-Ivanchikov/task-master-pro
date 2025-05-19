import React from "react";
import styles from "./Input.module.css";
export const Input = ({ label, error, required, id, className, ...rest }) => {
    const inputId = id || Math.random().toString(36).substring(2, 15);
    const defaultClassName = className ||
        [
            styles.input,
            error ? styles.inputError : "",
            required ? styles.inputRequired : "",
        ]
            .filter(Boolean)
            .join(" ");
    return (React.createElement("div", { className: styles.inputWrapper },
        label && (React.createElement("label", { htmlFor: inputId, className: styles.label },
            label,
            " ",
            required && React.createElement("span", { className: styles.required }, "*"))),
        React.createElement("input", { id: inputId, className: defaultClassName ?? "", required: required, ...rest }),
        error && React.createElement("p", { className: styles.errorText }, error)));
};
