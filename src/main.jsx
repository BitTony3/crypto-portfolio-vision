// Comprehensive polyfill
if (typeof globalThis === 'undefined') {
  globalThis = Function('return this')();
}
if (typeof global === 'undefined') {
  global = globalThis;
}
if (typeof window !== 'undefined') {
  window.global = window;
  window.Buffer = window.Buffer || require('buffer').Buffer;
  window.process = window.process || {
    env: { NODE_ENV: 'production' },
    version: [],
    nextTick: function(fn) { setTimeout(fn, 0); }
  };
  window.setImmediate = window.setImmediate || ((fn, ...args) => setTimeout(fn, 0, ...args));
}

import React from 'react';
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Moralis initialization is disabled
const mockMoralis = {
  start: () => console.log('Moralis mock: start called'),
  // Add other Moralis methods as needed
};

window.Moralis = mockMoralis;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
