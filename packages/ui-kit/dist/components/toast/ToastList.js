import React from "react";
import styles from "./ToastList.module.css";
export const ToastList = ({ toasts }) => {
    return (React.createElement("div", { className: styles.toastContainer }, toasts.map((toast) => (React.createElement("div", { key: toast.id, className: `${styles.toast} ${styles[toast.type || "info"]}` }, toast.message)))));
};
