"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormGroup = void 0;
const react_1 = __importDefault(require("react"));
const FormGroup_module_css_1 = __importDefault(require("./FormGroup.module.css"));
const FormGroup = ({ label, error, children, onSubmit, }) => {
    return (react_1.default.createElement("form", { className: FormGroup_module_css_1.default.formGroup, onSubmit: (e) => onSubmit?.(e) },
        label && react_1.default.createElement("label", { className: FormGroup_module_css_1.default.label }, label),
        children,
        error && react_1.default.createElement("span", { className: FormGroup_module_css_1.default.error }, error)));
};
exports.FormGroup = FormGroup;
