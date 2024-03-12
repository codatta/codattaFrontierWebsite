export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-px-to-viewport-8-plugin': {
      // exclude: [/node_modules/],
      unitToConvert: 'px',
      viewportWidth: 375,
      minPixelValue: 1,
    },
  },
}
