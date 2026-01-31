// Entry point - Initialize app
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./lib/i18n";
import "./style/index.css";
import "leaflet/dist/leaflet.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
