import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useEffect } from "react";
import {
  applyTheme,
  getSavedTheme,
} from "./../../../packages/ui-kit/src/utils/theme";

export default function App() {
  useEffect(() => {
    applyTheme(getSavedTheme());
  }, []);
  return <RouterProvider router={router} />;
}
