import React from "react";
import ReactDOM from "react-dom";
import styles from "./Modal.module.css";

type ModalProps = {
  title?: string;
  isOpen?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  footer?: React.ReactNode;
};

export const Modal = ({
  title,
  isOpen,
  onClose,
  children,
  footer,
}: ModalProps) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose?.();
      }

      if (isOpen) {
        document.addEventListener("keydown", handleKeyDown);
      }

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {title && <div className={styles.header}>{title}</div>}
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>,
    document.body
  );
};
