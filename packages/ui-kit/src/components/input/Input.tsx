import React from "react";
import styles from "./Input.module.css";

type InputProps = {
  label?: string;
  error?: string;
  required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Input = ({
  label,
  error,
  required,
  id,
  className,
  ...rest
}: InputProps) => {
  const inputId = id || Math.random().toString(36).substring(2, 15);
  const defaultClassName =
    className ||
    [
      styles.input,
      error ? styles.inputError : "",
      required ? styles.inputRequired : "",
    ]
      .filter(Boolean)
      .join(" ");

  return (
    <div className={styles.inputWrapper}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label} {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={defaultClassName ?? ""}
        required={required}
        {...rest}
      />
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
};
