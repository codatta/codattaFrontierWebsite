export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-px-to-viewport-8-plugin': {
      exclude: [/node_modules/],
      unitToConvert: 'px',
      viewportWidth: (file) => {
        // let num = 1920
        // if (file.indexOf('m_') !== -1) {
        //   num = 375
        // }
        return 1440
      },
    },
  },
}
