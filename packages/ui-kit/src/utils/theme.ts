export type ThemeMode = "light" | "dark";

const THEME_KEY = "theme";

export const applyTheme = (theme: ThemeMode) => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
};

export const getSavedTheme = (): ThemeMode => {
  const saved = localStorage.getItem(THEME_KEY) as ThemeMode | null;
  if (saved) return saved;

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
};

export const toggleTheme = (): ThemeMode => {
  const current = getSavedTheme();
  const next = current === "dark" ? "light" : "dark";
  applyTheme(next);
  return next;
};
