import React from 'react';
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import Moralis from 'moralis';

// Polyfill for 'global' object
if (typeof window !== 'undefined') {
  window.global = window;
  window.Buffer = window.Buffer || require('buffer').Buffer;
  window.process = window.process || {
    env: { NODE_ENV: 'production' },
    version: [],
    nextTick: function(fn) { setTimeout(fn, 0); }
  };
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
