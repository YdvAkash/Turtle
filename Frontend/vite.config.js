import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_REACT_APP_BACKEND_BASEURL, // Use process.env properly
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
})
