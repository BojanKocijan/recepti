import React from "react";
import ReactDOM from "react-dom/client";
import "./storagePolyfill.js";
import MealPlanner from "./MealPlanner.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MealPlanner />
  </React.StrictMode>
);
