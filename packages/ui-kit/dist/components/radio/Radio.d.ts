import React from "react";
type RadioProps = {
    label: string;
    name: string;
    value: string;
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
};
export declare const Radio: ({ label, name, value, checked, onChange, disabled, }: RadioProps) => React.JSX.Element;
export {};
//# sourceMappingURL=Radio.d.ts.map