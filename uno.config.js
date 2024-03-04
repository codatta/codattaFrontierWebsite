// uno.config.ts
import { defineConfig } from 'unocss'

export default defineConfig({
  rules: [
    ['text-base', { 'font-size': '16px' }],
    ['text-lg', { 'font-size': '18px' }],
    ['text-xl', { 'font-size': '20px' }],
    ['text-2xl', { 'font-size': '24px', 'line-height': '32px' }],
  ],
  theme: {
    extend: {
      boxShadow: {
        input: `0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)`,
      }
    }
  }
})