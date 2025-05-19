import React from "react";
import styles from "./Checkbox.module.css";
export const Checkbox = ({ name, label, checked = false, defaultChecked, disabled = false, indeterminate = false, required = false, error, onChange, ...rest }) => {
    const checkboxRef = React.useRef(null);
    React.useEffect(() => {
        if (checkboxRef.current) {
            checkboxRef.current.indeterminate = indeterminate;
        }
    }, [indeterminate]);
    const handleChange = (event) => {
        onChange?.(event.target.checked);
    };
    return (React.createElement("label", null,
        React.createElement("input", { type: "checkbox", name: name, checked: checked, defaultChecked: defaultChecked, disabled: disabled, ref: checkboxRef, required: required, className: styles.input + error ? " " + styles.error : "", onChange: (e) => handleChange(e), ...rest }),
        React.createElement("span", { className: styles.customCheckbox }),
        label && React.createElement("span", { className: styles.label }, label),
        error && React.createElement("div", { className: styles.errorMessage }, error)));
};
