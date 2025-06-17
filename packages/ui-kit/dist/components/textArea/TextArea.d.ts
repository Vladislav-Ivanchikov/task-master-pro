import React from "react";
type TextAreaProps = {
    label?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    disabled?: boolean;
    required?: boolean;
    error?: string;
    rows?: number;
    className?: string;
    style?: React.CSSProperties;
} & React.HTMLAttributes<HTMLTextAreaElement>;
export declare const TextArea: ({ label, placeholder, value, onChange, disabled, error, rows, className, style, required, }: TextAreaProps) => React.JSX.Element;
export {};
//# sourceMappingURL=TextArea.d.ts.map