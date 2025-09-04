import React from "react";
type FormGroupProps = {
    type?: "submit" | "reset" | "button";
    label?: string;
    error?: string;
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
    children: React.ReactNode;
} & React.FormHTMLAttributes<HTMLFormElement>;
export declare const FormGroup: ({ label, error, children, onSubmit, }: FormGroupProps) => React.JSX.Element;
export {};
//# sourceMappingURL=FormGroup.d.ts.map