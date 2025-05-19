import React from "react";
import styles from "./FormGroup.module.css";
export const FormGroup = ({ label, error, children }) => {
    return (React.createElement("div", { className: styles.formGroup },
        label && React.createElement("label", { className: styles.label }, label),
        children,
        error && React.createElement("span", { className: styles.error }, error)));
};
