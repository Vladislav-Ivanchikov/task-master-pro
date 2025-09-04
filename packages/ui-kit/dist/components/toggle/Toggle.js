"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toggle = void 0;
const react_1 = __importDefault(require("react"));
const Toggle_module_css_1 = __importDefault(require("./Toggle.module.css"));
const Toggle = ({ checked, disabled = false, label, required = false, onChange, }) => {
    const handleChange = (event) => {
        onChange?.(event);
    };
    return (react_1.default.createElement("label", { className: Toggle_module_css_1.default.toggleWrapper },
        react_1.default.createElement("input", { className: Toggle_module_css_1.default.input, type: "checkbox", checked: checked, disabled: disabled, onChange: (e) => handleChange(e) }),
        react_1.default.createElement("span", { className: Toggle_module_css_1.default.slider }),
        label && (react_1.default.createElement("span", { className: Toggle_module_css_1.default.label },
            label,
            required ? "*" : ""))));
};
exports.Toggle = Toggle;
