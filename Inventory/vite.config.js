import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'unsafe-none', // ✅ This disables strict isolation
      'Cross-Origin-Embedder-Policy': 'unsafe-none', // (optional, usually paired with COOP)
    }
  }
})
