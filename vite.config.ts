import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    minify: 'terser', // Use terser instead of esbuild for better CSP compatibility
    rollupOptions: {
      output: {
        // Ensure no eval is used in production bundles
        format: 'es'
      }
    }
  },
  esbuild: {
    // Disable eval usage but keep it simple
    keepNames: true
  },
  css: {
    devSourcemap: true
  },
  server: {
    headers: {},
    hmr: {
      overlay: true
    }
  },
  define: {
    global: 'globalThis',
  }
})
