import React from "react";
import ReactDOM from "react-dom";
import styles from "./Modal.module.css";
export const Modal = ({ title, isOpen, onClose, children, footer = null, }) => {
    React.useEffect(() => {
        const handleKeyDown = (e) => {
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
    if (!isOpen)
        return null;
    return ReactDOM.createPortal(React.createElement("div", { className: styles.overlay, onClick: onClose },
        React.createElement("div", { className: styles.modal, onClick: (e) => e.stopPropagation() },
            React.createElement("button", { className: styles.closeButton, onClick: onClose }, "\u00D7"),
            title && React.createElement("div", { className: styles.header }, title),
            children && React.createElement("div", { className: styles.body }, children),
            footer && React.createElement("div", { className: styles.footer }, footer))), document.body);
};
