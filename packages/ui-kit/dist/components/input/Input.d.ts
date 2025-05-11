import React from "react";
type InputProps = {
    label?: string;
    error?: string;
    required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;
export declare const Input: ({ label, error, required, id, className, ...rest }: InputProps) => React.JSX.Element;
export {};
//# sourceMappingURL=Input.d.ts.map