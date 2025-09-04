"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextArea = void 0;
const react_1 = __importDefault(require("react"));
const TextArea_module_css_1 = __importDefault(require("./TextArea.module.css"));
const TextArea = ({ label, placeholder, value, onChange, disabled = false, error, rows = 4, className = "", style, required, }) => {
    const textareaClass = [
        TextArea_module_css_1.default.textarea,
        error ? TextArea_module_css_1.default.error : "",
        disabled ? TextArea_module_css_1.default.disabled : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");
    return (react_1.default.createElement("div", { className: TextArea_module_css_1.default.wrapper, style: style },
        label && (react_1.default.createElement("label", { className: TextArea_module_css_1.default.label },
            label,
            " ",
            required && react_1.default.createElement("span", { className: TextArea_module_css_1.default.required }, "*"))),
        react_1.default.createElement("textarea", { className: textareaClass, placeholder: placeholder, value: value, onChange: onChange, disabled: disabled, rows: rows, required: required }),
        error && react_1.default.createElement("div", { className: TextArea_module_css_1.default.errorMessage }, error)));
};
exports.TextArea = TextArea;
