"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleTheme = exports.getSavedTheme = exports.applyTheme = void 0;
const THEME_KEY = "theme";
const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
};
exports.applyTheme = applyTheme;
const getSavedTheme = () => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved)
        return saved;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
};
exports.getSavedTheme = getSavedTheme;
const toggleTheme = () => {
    const current = (0, exports.getSavedTheme)();
    const next = current === "dark" ? "light" : "dark";
    (0, exports.applyTheme)(next);
    return next;
};
exports.toggleTheme = toggleTheme;
