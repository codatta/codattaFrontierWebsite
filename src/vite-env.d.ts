/// <reference types="vite/client" />

/* eslint-disable */
interface Window {
  Telegram: any
  chrome: any
}

declare module '*.md' {
  const value: string
  export default value
}