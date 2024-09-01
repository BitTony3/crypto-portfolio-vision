import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import Moralis from 'moralis';

// Polyfill for 'global' object
if (typeof window !== 'undefined' && typeof window.global === 'undefined') {
  window.global = window;
}

// Initialize Moralis
Moralis.start({
  apiKey: import.meta.env.VITE_MORALIS_API_KEY
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
