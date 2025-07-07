import React from "react";
import styles from "./Loader.module.css";
export const Loader = ({ size = "md", className = "", }) => {
    const sizeClass = size === "sm" ? styles.sm : size === "lg" ? styles.lg : styles.md;
    return (React.createElement("div", { className: `${styles.loader} ${sizeClass} ${className}`.trim() }));
};
