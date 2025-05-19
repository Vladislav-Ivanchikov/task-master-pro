import React from "react";
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
export declare const Button: ({ children, variant, size, onClick, disabled, loading, iconLeft, iconRight, }: ButtonProps) => React.JSX.Element;
//# sourceMappingURL=Button.d.ts.map