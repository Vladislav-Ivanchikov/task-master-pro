import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./store/index";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <Provider store={store}>
        <DndProvider backend={HTML5Backend}>
          <App />
        </DndProvider>
      </Provider>
    </AuthProvider>
  </React.StrictMode>
);
