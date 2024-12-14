import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.CDN_ASSETS_PATH
    ? `https://s.codatta.io/${process.env.CDN_ASSETS_PATH}`
    : undefined,
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5175,
    host: '0.0.0.0',
    proxy: {
      '^/api/': {
        target: 'http://app-test.b18a.io/',
        changeOrigin: true
      }
    }
  }
})
