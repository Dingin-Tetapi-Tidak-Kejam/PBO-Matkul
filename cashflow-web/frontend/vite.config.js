import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // Development: proxy /api ke Spring Boot
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  },

  // Production build: output ke dist/ (Maven Plugin akan menyalinnya ke resources/static)
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
})
