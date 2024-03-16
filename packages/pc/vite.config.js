import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import Unocss from 'unocss/vite'

import path from 'path'

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
})
