"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modal = void 0;
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const Modal_module_css_1 = __importDefault(require("./Modal.module.css"));
const Modal = ({ title, isOpen, onClose, children, footer = null, }) => {
    react_1.default.useEffect(() => {
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
    return react_dom_1.default.createPortal(react_1.default.createElement("div", { className: Modal_module_css_1.default.overlay, onClick: onClose },
        react_1.default.createElement("div", { className: Modal_module_css_1.default.modal, onClick: (e) => e.stopPropagation() },
            react_1.default.createElement("button", { className: Modal_module_css_1.default.closeButton, onClick: onClose }, "\u00D7"),
            title && react_1.default.createElement("div", { className: Modal_module_css_1.default.header }, title),
            children && react_1.default.createElement("div", { className: Modal_module_css_1.default.body }, children),
            footer && react_1.default.createElement("div", { className: Modal_module_css_1.default.footer }, footer))), document.body);
};
exports.Modal = Modal;
