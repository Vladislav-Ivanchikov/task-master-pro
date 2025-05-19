import React from "react";
type CheckboxProps = {
    name?: string;
    label?: string;
    error?: string;
    required?: boolean;
    checked?: boolean;
    defaultChecked?: boolean;
    indeterminate?: boolean;
    disabled?: boolean;
    onChange?: (checked: boolean) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;
export declare const Checkbox: ({ name, label, checked, defaultChecked, disabled, indeterminate, required, error, onChange, ...rest }: CheckboxProps) => React.JSX.Element;
export {};
//# sourceMappingURL=Checkbox.d.ts.map