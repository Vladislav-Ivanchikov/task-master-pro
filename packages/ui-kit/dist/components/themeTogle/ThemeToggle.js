"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeToggle = void 0;
const react_1 = __importDefault(require("react"));
const react_2 = require("react");
const ThemeToggle_module_css_1 = __importDefault(require("./ThemeToggle.module.css"));
const theme_1 = require("../../utils/theme");
const ThemeToggle = () => {
    const [theme, setTheme] = (0, react_2.useState)("light");
    (0, react_2.useEffect)(() => {
        setTheme((0, theme_1.getSavedTheme)());
    }, []);
    const handleToggle = () => {
        const next = (0, theme_1.toggleTheme)();
        setTheme(next);
    };
    return (react_1.default.createElement("button", { onClick: handleToggle, className: ThemeToggle_module_css_1.default.toggle, "aria-label": `Switch to ${theme === "light" ? "dark" : "light"} theme` }, theme === "light" ? "🌞" : "🌜"));
};
exports.ThemeToggle = ThemeToggle;
