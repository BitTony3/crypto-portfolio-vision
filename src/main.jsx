// Polyfill for 'global' object
if (typeof global === 'undefined') {
  window.global = window;
}

import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import Moralis from 'moralis';

// Ensure 'global' is available
window.global = window;

// Initialize Moralis
Moralis.start({
  apiKey: 'YOUR_MORALIS_API_KEY' // Replace with your actual Moralis API key
});

ReactDOM.createRoot(document.getElementById("root")).render(
    <App />
);
