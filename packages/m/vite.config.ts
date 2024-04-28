import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Unocss from 'unocss/vite'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve(__dirname, '.env') })
import vitePluginGCPStorage from '../../vite-plugin-gcp-storage'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Unocss({
      configFile: './unocss.config.ts',
    }),
    vitePluginGCPStorage({
      bucket: 'static-chaintool-ai',
      keyFile: path.resolve(
        __dirname,
        '../../',
        './chaintool-etl-32deb09152c3.json'
      ),
      exclude: ['**/*.map', '**/*.html'],
      bucketDomain: 'https://static.b18a.io',
      uploadPath: 'web/m',
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
