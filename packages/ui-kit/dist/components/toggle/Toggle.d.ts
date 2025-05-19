import React from "react";
type ToggleProps = {
    label?: string;
    checked?: boolean;
    required?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
};
export declare const Toggle: ({ checked, disabled, label, required, onChange, }: ToggleProps) => React.JSX.Element;
export {};
//# sourceMappingURL=Toggle.d.ts.map