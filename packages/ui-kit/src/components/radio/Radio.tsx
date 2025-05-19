import React from "react";
import styles from "./Radio.module.css";

type RadioProps = {
  label: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
};

export const Radio = ({
  label,
  name,
  value,
  checked,
  onChange,
  disabled,
}: RadioProps) => {
  return (
    <label className={styles.radioWrapper}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={styles.input}
      />
      <span className={styles.customRadio} />
      <span className={styles.label}>{label}</span>
    </label>
  );
};
