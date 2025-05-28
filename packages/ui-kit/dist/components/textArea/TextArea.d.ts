import React from "react";
type TextAreaProps = {
    label?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    disabled?: boolean;
    error?: string;
    rows?: number;
    className?: string;
    style?: React.CSSProperties;
};
export declare const TextArea: ({ label, placeholder, value, onChange, disabled, error, rows, className, style, }: TextAreaProps) => React.JSX.Element;
export {};
//# sourceMappingURL=TextArea.d.ts.map