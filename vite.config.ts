import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
  },
  esbuild: {
    // Avoid eval usage in development
    keepNames: true,
  },
  server: {
    // Configure headers for development
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: blob:; connect-src 'self' http://localhost:* ws://localhost:*"
    }
  },
  define: {
    // Ensure proper environment variables
    global: 'globalThis',
  }
})
