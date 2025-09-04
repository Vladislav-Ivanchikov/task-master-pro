import React from "react";
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
export declare const Button: ({ children, variant, size, type, onClick, disabled, loading, iconLeft, iconRight, }: ButtonProps) => React.JSX.Element;
//# sourceMappingURL=Button.d.ts.map