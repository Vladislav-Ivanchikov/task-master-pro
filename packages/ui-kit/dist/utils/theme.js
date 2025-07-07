const THEME_KEY = "theme";
export const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
};
export const getSavedTheme = () => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved)
        return saved;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
};
export const toggleTheme = () => {
    const current = getSavedTheme();
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    return next;
};
