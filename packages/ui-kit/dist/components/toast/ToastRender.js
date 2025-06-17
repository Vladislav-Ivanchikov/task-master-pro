import React from "react";
import styles from "./ToastRender.module.css";
import { useToast } from "./ToastContext";
export const ToastRender = () => {
    const { toasts, removeToast } = useToast();
    return (React.createElement("div", { className: styles.toastContainer }, toasts.map((toast) => (React.createElement("div", { key: toast.id, className: `${styles.toast} ${styles[toast.type]}`, onClick: () => removeToast(toast.id) }, toast.message)))));
};
