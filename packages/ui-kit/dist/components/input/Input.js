"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Input = void 0;
const react_1 = __importDefault(require("react"));
const Input_module_css_1 = __importDefault(require("./Input.module.css"));
const Input = ({ label, error, required, id, className, ...rest }) => {
    const inputId = id || Math.random().toString(36).substring(2, 15);
    const defaultClassName = className ||
        [
            Input_module_css_1.default.input,
            error ? Input_module_css_1.default.inputError : "",
            required ? Input_module_css_1.default.inputRequired : "",
        ]
            .filter(Boolean)
            .join(" ");
    return (react_1.default.createElement("div", { className: Input_module_css_1.default.inputWrapper },
        label && (react_1.default.createElement("label", { htmlFor: inputId, className: Input_module_css_1.default.label },
            label,
            " ",
            required && react_1.default.createElement("span", { className: Input_module_css_1.default.required }, "*"))),
        react_1.default.createElement("input", { id: inputId, className: defaultClassName ?? "", required: required, ...rest }),
        error && react_1.default.createElement("p", { className: Input_module_css_1.default.errorText }, error)));
};
exports.Input = Input;
