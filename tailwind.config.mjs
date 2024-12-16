/** @type {import('tailwindcss').Config} */
import animatedPlugin from 'tailwindcss-animated'
import aspectRatioPlugin from '@tailwindcss/aspect-ratio'

module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#875DFF'
      }
    }
  },
  plugins: [animatedPlugin, aspectRatioPlugin]
}
