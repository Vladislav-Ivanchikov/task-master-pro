import React from "react";

export type ButtonVariant = "primary" | "secondary" | "danger";

export interface ButtonProps {
  variant?: ButtonVariant;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

export const Button = ({
  variant = "primary",
  onClick,
  disabled = false,
  children,
}: ButtonProps) => {
  const className = `button button-${variant}${
    disabled ? " button-disabled" : ""
  }`;
  return (
    <button className={className} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};
