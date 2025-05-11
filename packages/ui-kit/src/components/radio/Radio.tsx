import React from "react";
import styles from "./Radio.module.css";
type RadioProps = {
  name?: string;
  label?: string;
  error?: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
};

export const Radio = ({
  name,
  label,
  checked,
  disabled = false,
  onChange,
  error = "",
}: RadioProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
  };
  return (
    <label>
      <input
        type="radio"
        className={styles.radioWrapper}
        name={name}
        checked={checked}
        onChange={(e) => handleChange(e)}
        disabled={disabled}
      />
      <span className={styles.customRadio} />
      {label && <span className={styles.label}>{label}</span>}
      {error && <div className={styles.errorMessage}>{error}</div>}
    </label>
  );
};
