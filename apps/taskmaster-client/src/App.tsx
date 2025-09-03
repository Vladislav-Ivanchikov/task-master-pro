import { RouterProvider } from "react-router-dom";
import { router } from "./router.js";
import { useEffect } from "react";
import {
  applyTheme,
  getSavedTheme,
} from "./../../../packages/ui-kit/src/utils/theme.js";

export default function App() {
  useEffect(() => {
    applyTheme(getSavedTheme());
  }, []);
  return <RouterProvider router={router} />;
}
