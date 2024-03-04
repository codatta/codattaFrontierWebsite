import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react'
// import basicSsl from '@vitejs/plugin-basic-ssl'
import { presetUno, presetAttributify } from 'unocss'
import Unocss from 'unocss/vite'
import postcssImport from 'postcss-import'
import postcssAutoPrefixer from 'autoprefixer'
import postcssPxToViewport from 'postcss-px-to-viewport'

import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    splitVendorChunkPlugin(),
    react(),
    // basicSsl(),
    Unocss({
      presets: [presetUno(), presetAttributify()],
    }),
  ],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    // https: true,
    open: false,
  },
  build: {
    emptyOutDir: true,
    outDir: 'dist',
    assetsDir: 'assets',
    assetsInlineLimit: 500000, // 26kb以下
    cssCodeSplit: false, // css不拆分
    terserOptions: {
      compress: {
        drop_console: true, // 从压缩后的代码中删除console函数调用
        drop_debugger: true, // 从压缩后的代码中删除debugger关键词
      },
    },
  },
  css: {
    postcss: {
      plugins: [
        //解决css文件压缩合并时的警告——warning: "@charset" must be the first rule in the file
        {
          postcssPlugin: 'internal:charset-removal',
          AtRule: {
            charset: (atRule) => {
              if (atRule.name === 'charset') {
                atRule.remove()
              }
            },
          },
        },
        postcssImport,
        postcssAutoPrefixer,
        postcssPxToViewport({
          viewportWidth: 1440,
          viewportHeight: 750,
          unitPrecision: 5,
          viewportUnit: 'vw',
          selectorBlackList: ['.ignore', '.hairlines'],
          minPixelValue: 1,
          mediaQuery: false,
          exclude: /(node_module)/,
        }),
      ],
    },
  },
})
