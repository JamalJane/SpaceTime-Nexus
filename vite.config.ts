import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: './index.html',
    },
  },
  resolve: {
    alias: {
      '@': new URL('./', import.meta.url).pathname.replace(/\/$/, ''),
    },
  },
});
