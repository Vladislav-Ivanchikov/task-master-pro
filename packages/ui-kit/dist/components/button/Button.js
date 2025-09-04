"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
const react_1 = __importDefault(require("react"));
const Button_module_css_1 = __importDefault(require("./Button.module.css"));
const Loader_1 = require("../loader/Loader");
const Button = ({ children, variant = "primary", size = "medium", type, onClick, disabled = false, loading = false, iconLeft, iconRight, }) => {
    const className = [
        Button_module_css_1.default.button,
        Button_module_css_1.default[variant],
        Button_module_css_1.default[size],
        loading ? Button_module_css_1.default.loading : "",
        disabled ? Button_module_css_1.default.disabled : "",
    ]
        .filter(Boolean)
        .join(" ");
    return (react_1.default.createElement("button", { className: className, onClick: onClick, disabled: disabled || loading, type: type }, loading ? (react_1.default.createElement(Loader_1.Loader, { size: "sm" })) : (react_1.default.createElement(react_1.default.Fragment, null,
        iconLeft && react_1.default.createElement("span", { className: Button_module_css_1.default.icon }, iconLeft),
        children,
        iconRight && react_1.default.createElement("span", { className: Button_module_css_1.default.icon }, iconRight)))));
};
exports.Button = Button;
