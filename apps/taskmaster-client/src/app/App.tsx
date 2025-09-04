import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.js";
import { applyTheme, getSavedTheme } from "@taskmaster/ui-kit/utils/theme.js";

export default function App() {
  useEffect(() => {
    applyTheme(getSavedTheme());
  }, []);
  return <RouterProvider router={router} />;
}
