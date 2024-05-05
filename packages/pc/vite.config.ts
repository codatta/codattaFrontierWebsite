import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Unocss from 'unocss/vite'
import path from 'path'
import dotenv from 'dotenv'
import vitePluginGCPStorage from '../../vite-plugin-gcp-storage'

dotenv.config({ path: path.resolve(__dirname, '../../', './.env') })

console.log(
  'VITE_DYNAMIC_ENVIRONMENT_ID',
  process.env.VITE_DYNAMIC_ENVIRONMENT_ID
)

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.PC_CDN_ASSETS_PATH ? `https://static.b18a.io/${process.env.PC_CDN_ASSETS_PATH}` : './',
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
      uploadPath: process.env.PC_CDN_ASSETS_PATH,
    }),
  ],
  define: {
    'process.env': {},
  },
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
