import React from "react";
import styles from "./Button.module.css";

export type Variant = "primary" | "secondary" | "danger";
export type Size = "small" | "medium" | "large";

export type ButtonProps = {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  children,
  variant = "primary",
  size = "medium",
  onClick,
  disabled = false,
  loading = false,
  iconLeft,
  iconRight,
}: ButtonProps) => {
  const className = [
    styles.button,
    styles[variant],
    styles[size],
    loading ? styles.loading : "",
    disabled ? styles.disabled : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled || loading}
      type="button"
    >
      {loading ? (
        "Загруз..."
      ) : (
        <>
          {iconLeft && <span className={styles.icon}>{iconLeft}</span>}
          {children}
          {iconRight && <span className={styles.icon}>{iconRight}</span>}
        </>
      )}
    </button>
  );
};
