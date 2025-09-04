"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Loader = void 0;
const react_1 = __importDefault(require("react"));
const Loader_module_css_1 = __importDefault(require("./Loader.module.css"));
const Loader = ({ size = "md", className = "", }) => {
    const sizeClass = size === "sm" ? Loader_module_css_1.default.sm : size === "lg" ? Loader_module_css_1.default.lg : Loader_module_css_1.default.md;
    return (react_1.default.createElement("div", { className: `${Loader_module_css_1.default.loader} ${sizeClass} ${className}`.trim() }));
};
exports.Loader = Loader;
