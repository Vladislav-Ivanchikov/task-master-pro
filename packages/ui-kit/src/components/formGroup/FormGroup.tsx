import React from "react";
import styles from "./FormGroup.module.css";

type FormGroupProps = {
  type?: "submit" | "reset" | "button";
  label?: string;
  error?: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
} & React.FormHTMLAttributes<HTMLFormElement>;

export const FormGroup = ({
  label,
  error,
  children,
  onSubmit,
}: FormGroupProps) => {
  return (
    <form className={styles.formGroup} onSubmit={(e) => onSubmit?.(e)}>
      {label && <label className={styles.label}>{label}</label>}
      {children}
      {error && <span className={styles.error}>{error}</span>}
    </form>
  );
};
