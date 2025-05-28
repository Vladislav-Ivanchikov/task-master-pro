import React from "react";
import styles from "./TextArea.module.css";

type TextAreaProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  error?: string;
  rows?: number;
  className?: string;
  style?: React.CSSProperties;
};

export const TextArea = ({
  label,
  placeholder,
  value,
  onChange,
  disabled = false,
  error,
  rows = 4,
  className = "",
  style,
}: TextAreaProps) => {
  const textareaClass = [
    styles.textarea,
    error ? styles.error : "",
    disabled ? styles.disabled : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.wrapper} style={style}>
      {label && <label className={styles.label}>{label}</label>}
      <textarea
        className={textareaClass}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        rows={rows}
      />
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};
