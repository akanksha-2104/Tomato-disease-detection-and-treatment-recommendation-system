import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Changed from 5000 to 3000 to avoid conflict with backend
    strictPort: true,
  }
})