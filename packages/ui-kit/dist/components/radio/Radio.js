import React from "react";
import styles from "./Radio.module.css";
export const Radio = ({ label, name, value, checked, onChange, disabled, }) => {
    return (React.createElement("label", { className: styles.radioWrapper },
        React.createElement("input", { type: "radio", name: name, value: value, checked: checked, onChange: onChange, disabled: disabled, className: styles.input }),
        React.createElement("span", { className: styles.customRadio }),
        React.createElement("span", { className: styles.label }, label)));
};
