"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToastList = void 0;
const react_1 = __importDefault(require("react"));
const ToastList_module_css_1 = __importDefault(require("./ToastList.module.css"));
const ToastList = ({ toasts }) => {
    return (react_1.default.createElement("div", { className: ToastList_module_css_1.default.toastContainer }, toasts.map((toast) => (react_1.default.createElement("div", { key: toast.id, className: `${ToastList_module_css_1.default.toast} ${ToastList_module_css_1.default[toast.type || "info"]}` }, toast.message)))));
};
exports.ToastList = ToastList;
