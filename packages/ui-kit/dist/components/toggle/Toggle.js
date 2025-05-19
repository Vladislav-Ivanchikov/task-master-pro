import React from "react";
import styles from "./Toggle.module.css";
export const Toggle = ({ checked, disabled = false, label, required = false, onChange, }) => {
    const handleChange = (event) => {
        onChange?.(event);
    };
    return (React.createElement("label", { className: styles.toggleWrapper },
        React.createElement("input", { className: styles.input, type: "checkbox", checked: checked, disabled: disabled, onChange: (e) => handleChange(e) }),
        React.createElement("span", { className: styles.slider }),
        label && (React.createElement("span", { className: styles.label },
            label,
            required ? "*" : ""))));
};
