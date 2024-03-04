import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// import { presetUno, presetAttributify } from 'unocss'
// import Unocss from 'unocss/vite'

import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Unocss({
    //   presets: [presetUno(), presetAttributify()],
    //   include: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    // }),
  ],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
