import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import site from './config/site.js';
import './styles.css';

// Apply user-controlled design tokens from the config.
const root = document.documentElement;
const a = site.appearance;
root.style.setProperty('--bg', a.background);
root.style.setProperty('--text', a.text);
root.style.setProperty('--accent', a.accent);
root.style.setProperty('--muted', a.muted);
root.style.setProperty('--font-display', `"${a.displayFont}", Impact, "Arial Narrow", sans-serif`);
root.style.setProperty('--font-body', `"${a.bodyFont}", system-ui, -apple-system, "Segoe UI", sans-serif`);
root.style.setProperty('--font-accent', `"${a.accentFont}", cursive`);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
