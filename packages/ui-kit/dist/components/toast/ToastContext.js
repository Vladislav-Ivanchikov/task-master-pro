import React, { createContext, useContext, useState, useCallback } from "react";
import { v4 as uuid } from "uuid";
import { ToastList } from "./ToastList";
const ToastContext = createContext(undefined);
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const showToast = useCallback((toast) => {
        const id = uuid();
        const newToast = { ...toast, id };
        setToasts((prev) => [...prev, newToast]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, toast.duration || 5000);
    }, []);
    return (React.createElement(ToastContext.Provider, { value: { showToast } },
        children,
        React.createElement(ToastList, { toasts: toasts })));
};
export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx)
        throw new Error("useToast must be used within ToastProvider");
    return ctx;
};
