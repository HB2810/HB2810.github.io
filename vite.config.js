import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Base path:
//   The site is a GitHub Pages user site (https://hb2810.github.io/) served from the root.
//   To serve from a sub-path instead, set VITE_BASE=/sub-path/ in the host's
//   environment variables (or run `VITE_BASE=/sub-path/ npm run build`).
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/',
});
