import React from "react";
import { Toast } from "./toast.types";
import styles from "./ToastList.module.css";

export const ToastList = ({ toasts }: { toasts: Toast[] }) => {
  return (
    <div className={styles.toastContainer}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${styles.toast} ${styles[toast.type || "info"]}`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};
