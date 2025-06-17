import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/index";
import { AuthProvider } from "./context/AuthContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ToastProvider } from "@taskmaster/ui-kit"; // Replace with the correct export
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <Provider store={store}>
        <DndProvider backend={HTML5Backend}>
          <ToastProvider>
            <App />
          </ToastProvider>
        </DndProvider>
      </Provider>
    </AuthProvider>
  </React.StrictMode>
);
