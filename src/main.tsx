// Entry point - Initialize app
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./style/index.css";
import { ThemeProvider } from "@/providers";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
