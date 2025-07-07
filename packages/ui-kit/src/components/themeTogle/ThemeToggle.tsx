import React from "react";
import { useEffect, useState } from "react";
import styles from "./ThemeToggle.module.css";
import { getSavedTheme, toggleTheme } from "../../utils/theme";

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setTheme(getSavedTheme());
  }, []);

  const handleToggle = () => {
    const next = toggleTheme();
    setTheme(next);
  };

  return (
    <button
      onClick={handleToggle}
      className={styles.toggle}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
    >
      {theme === "light" ? "🌞" : "🌜"}
    </button>
  );
};
