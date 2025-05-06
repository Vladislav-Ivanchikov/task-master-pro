import React from "react";
export type ButtonVariant = "primary" | "secondary" | "danger";
export interface ButtonProps {
    variant?: ButtonVariant;
    onClick: () => void;
    disabled?: boolean;
    children: React.ReactNode;
}
export declare const Button: ({ variant, onClick, disabled, children, }: ButtonProps) => React.JSX.Element;
//# sourceMappingURL=Button.d.ts.map