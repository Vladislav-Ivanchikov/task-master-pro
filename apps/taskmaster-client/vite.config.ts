import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    plugins: [react()],
    resolve: {
      alias: [
        {
          find: "@taskmaster/ui-kit",
          replacement: isDev
            ? path.resolve(__dirname, "../../packages/ui-kit/src")
            : path.resolve(__dirname, "../../packages/ui-kit/dist"),
        },
      ],
    },
    // server: { port: 3000 },
  };
});
