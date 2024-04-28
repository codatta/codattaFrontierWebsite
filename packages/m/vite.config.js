import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import Unocss from 'unocss/vite'

import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve(__dirname, '.env') })

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Unocss({
      configFile: './unocss.config.ts',
    }),
  ],
  define: {
    'process.env': {},
  },
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    // port: 5175,
    open: false,
    proxy: {
      '^/api/': {
        target: 'https://app.test.b18a.io',
        changeOrigin: true,
      },
    },
  },
})
