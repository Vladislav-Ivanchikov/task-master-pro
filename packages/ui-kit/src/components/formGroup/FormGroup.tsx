import React from "react";
import styles from "./FormGroup.module.css";

type FormGroupProps = {
  label?: string;
  error?: string;
  children: React.ReactNode;
};

export const FormGroup = ({ label, error, children }: FormGroupProps) => {
  return (
    <div className={styles.formGroup}>
      {label && <label className={styles.label}>{label}</label>}
      {children}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};
