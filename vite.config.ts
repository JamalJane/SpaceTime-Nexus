import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
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
        },
      },
    },
  },
})
