import React from "react";
type ModalProps = {
    title?: string;
    isOpen?: boolean;
    onClose?: () => void;
    children?: React.ReactNode;
    footer?: React.ReactNode;
};
export declare const Modal: ({ title, isOpen, onClose, children, footer, }: ModalProps) => React.ReactPortal | null;
export {};
//# sourceMappingURL=Modal.d.ts.map