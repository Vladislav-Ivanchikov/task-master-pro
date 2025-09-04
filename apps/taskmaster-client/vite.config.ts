import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    plugins: [react()],
    resolve: {
      alias: {
        // UI Kit
        "@taskmaster/ui-kit": isDev
          ? path.resolve(__dirname, "../../packages/ui-kit/src")
          : path.resolve(__dirname, "../../packages/ui-kit/dist"),
        "@ui-kit": path.resolve(__dirname, "../../packages/ui-kit/src"),

        // Types
        "@appTypes": path.resolve(__dirname, "../../packages/types"),

        // FSD слои
        "@app": path.resolve(__dirname, "src/app"),
        "@entities": path.resolve(__dirname, "src/entities"),
        "@features": path.resolve(__dirname, "src/features"),
        "@shared": path.resolve(__dirname, "src/shared"),
        "@widgets": path.resolve(__dirname, "src/widgets"),
        "@pages": path.resolve(__dirname, "src/pages"),
      },
    },
    // server: { port: 3000 },
  };
});
