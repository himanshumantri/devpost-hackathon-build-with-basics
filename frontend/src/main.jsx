import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import AirportBackground from "./components/AirportBackground.jsx";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AirportBackground />
    <App />
  </React.StrictMode>
);
