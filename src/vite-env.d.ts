/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

/* eslint-disable */
interface Window {
  Telegram: any
  chrome: any
  native: any
}

declare module '*.md' {
  const value: string
  export default value
}

declare module '*#file' {
  const src: string
  export default src
}
