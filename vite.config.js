import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Base path:
//   GitHub Pages project site (https://hb2810.github.io/HB-Portfolio/) needs '/HB-Portfolio/'.
//   Vercel, Netlify or a custom domain serve from the root: set VITE_BASE=/ in that host's
//   environment variables (or run `VITE_BASE=/ npm run build`).
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/HB-Portfolio/',
});
