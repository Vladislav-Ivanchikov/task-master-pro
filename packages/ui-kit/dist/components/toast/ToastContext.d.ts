import React from "react";
import { Toast } from "./toast.types";
interface ToastContextType {
    showToast: (toast: Omit<Toast, "id">) => void;
}
export declare const ToastProvider: ({ children }: {
    children: React.ReactNode;
}) => React.JSX.Element;
export declare const useToast: () => ToastContextType;
export {};
//# sourceMappingURL=ToastContext.d.ts.map