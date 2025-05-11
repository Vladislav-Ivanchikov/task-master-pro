import React from "react";
import styles from "./Checkbox.module.css";

type CheckboxProps = {
  name?: string;
  label?: string;
  error?: string;
  required?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Checkbox = ({
  name,
  label,
  checked = false,
  defaultChecked,
  disabled = false,
  indeterminate = false,
  required = false,
  error,
  onChange,
  ...rest
}: CheckboxProps) => {
  const checkboxRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.checked);
  };

  return (
    <label>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        ref={checkboxRef}
        required={required}
        className={styles.input + error ? " " + styles.error : ""}
        onChange={(e) => handleChange(e)}
        {...rest}
      />
      <span className={styles.customCheckbox} />
      {label && <span className={styles.label}>{label}</span>}
      {error && <div className={styles.errorMessage}>{error}</div>}
    </label>
  );
};
