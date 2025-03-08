import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({ fastRefresh: false })], // Disable Fast Refresh
  server: {
    hmr: false // Disable HMR entirely
  }
});
