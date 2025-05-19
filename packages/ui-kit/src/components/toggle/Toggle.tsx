import React from "react";
import styles from "./Toggle.module.css";

type ToggleProps = {
  label?: string;
  checked?: boolean;
  required?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
};

export const Toggle = ({
  checked,
  disabled = false,
  label,
  required = false,
  onChange,
}: ToggleProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
  };
  return (
    <label className={styles.toggleWrapper}>
      <input
        className={styles.input}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => handleChange(e)}
      />
      <span className={styles.slider} />
      {label && (
        <span className={styles.label}>
          {label}
          {required ? "*" : ""}
        </span>
      )}
    </label>
  );
};
