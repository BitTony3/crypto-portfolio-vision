// Polyfill for 'global' object
if (typeof global === 'undefined') {
  window.global = window;
}

import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Ensure 'global' is available
window.global = window;

ReactDOM.createRoot(document.getElementById("root")).render(
    <App />
);
