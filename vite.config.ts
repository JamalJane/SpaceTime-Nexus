import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  worker: {
    format: 'es',
  },
  optimizeDeps: {
    exclude: ['satellite.js'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three-core': ['three'],
          'three-addons': ['@react-three/fiber', '@react-three/drei'],
          'vendor': ['react', 'react-dom'],
          'animation': ['gsap', 'framer-motion'],
        },
      },
    },
  },
})
