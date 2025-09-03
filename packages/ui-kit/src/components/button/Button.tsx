import React from "react";
import styles from "./Button.module.css";
import { Loader } from "../loader/Loader";

export type Variant = "primary" | "secondary" | "danger" | "alternate";
export type Size = "small" | "medium" | "large";
export type Type = "button" | "submit" | "reset";

export type ButtonProps = {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  type?: Type;
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
  type,
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
      type={type}
    >
      {loading ? (
        <Loader size="sm" />
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
