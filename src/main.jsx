import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// ✅ Use BrowserRouter instead of HashRouter
import { BrowserRouter } from "react-router-dom";

// Note: Axios configuration is now handled in src/lib/axios.js

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
