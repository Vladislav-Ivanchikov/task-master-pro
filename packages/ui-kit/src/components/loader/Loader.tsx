import React from "react";
import styles from "./Loader.module.css";

type LoaderProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

export const Loader: React.FC<LoaderProps> = ({
  size = "md",
  className = "",
}) => {
  const sizeClass =
    size === "sm" ? styles.sm : size === "lg" ? styles.lg : styles.md;

  return (
    <div className={`${styles.loader} ${sizeClass} ${className}`.trim()} />
  );
};
