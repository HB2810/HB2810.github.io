import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Base path matches the GitHub Pages project URL (https://hb2810.github.io/HB-Portfolio/).
// Change to '/' if you deploy to a custom domain or the root of a host.
export default defineConfig({
  plugins: [react()],
  base: '/HB-Portfolio/',
});
