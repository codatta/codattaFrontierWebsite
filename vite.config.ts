import { HttpProxy, ProxyOptions, defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { ClientRequest, IncomingMessage, ServerResponse } from 'http'
import svgr from 'vite-plugin-svgr'
import dotenv from 'dotenv'

dotenv.config()

function proxyDebug(proxy: HttpProxy.Server, _options: ProxyOptions) {
  proxy.on(
    'error',
    (err: Error, _req: IncomingMessage, _res: ServerResponse<IncomingMessage>, _target?: HttpProxy.ProxyTargetUrl) => {
      console.log('proxy error', err)
    }
  )
  proxy.on('proxyReq', (proxyReq: ClientRequest, req: IncomingMessage, _res: ServerResponse<IncomingMessage>) => {
    console.log(
      '[Request]:',
      req.method,
      req.url,
      ' => ',
      `${proxyReq.method} ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`
    )
  })
  proxy.on('proxyRes', (proxyRes: IncomingMessage, req: IncomingMessage, _res: ServerResponse<IncomingMessage>) => {
    console.log('[Response]:', proxyRes.statusCode, req.url)
  })
}

// https://vite.dev/config/
export default defineConfig({
  base: process.env.CDN_ASSETS_PATH ? `https://s.codatta.io/${process.env.CDN_ASSETS_PATH}` : undefined,
  assetsInclude: ['**/*.md'],
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // codatta-connect: ~1MB, standalone SDK, rarely changes
            if (id.includes('codatta-connect')) return 'vendor-codatta'

            // Web3 stack: viem/wagmi/tonconnect/ox/secp256k1 etc.
            if (
              id.includes('viem') ||
              id.includes('wagmi') ||
              id.includes('@wagmi') ||
              id.includes('@tonconnect') ||
              id.includes('/ox/') ||
              id.includes('ox/_esm') ||
              id.includes('secp256k1') ||
              id.includes('@noble') ||
              id.includes('@scure')
            )
              return 'vendor-web3'

            // React ecosystem: note lucide-react / react-konva BEFORE generic 'react'
            if (id.includes('lucide-react')) return 'vendor-react'
            if (id.includes('react-konva') || id.includes('/konva/')) return 'page-frontier'
            if (
              id.includes('react-router') ||
              id.includes('react-dom') ||
              id.includes('framer-motion') ||
              id.includes('react')
            )
              return 'vendor-react'

            // Everything else (antd, recharts, dayjs, axios, valtio, etc.) → one stable chunk
            return 'vendor-libs'
          }

          // Page-level chunking
          if (id.includes('/src/views/')) {
            // if (id.includes('/frontier/')) return 'page-frontier'
            if (id.includes('/settings/')) return 'page-settings'
            if (id.includes('/referral/')) return 'page-referral'
            if (id.includes('/dataset/')) return 'page-dataset'
          }
        }
      }
    }
  },
  server: {
    port: 5175,
    host: '0.0.0.0',
    proxy: {
      '^/api': {
        target: 'https://app-test.b18a.io/',
        // target: 'https://app.codatta.io/',
        changeOrigin: true,
        configure: proxyDebug
      }
    }
  }
})
