/** @type {import('tailwindcss').Config} */
import animatedPlugin from 'tailwindcss-animated'
import aspectRatioPlugin from '@tailwindcss/aspect-ratio'

module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        primary: '0px 4px 8px 0px #875DFF1A, 0px 14px 14px 0px #875DFF17'
      },
      colors: {
        primary: '#875DFF',
        gray: {
          DEFAULT: '#1C1C26',
          50: '#252532',
          100: '#2E2E37',
          200: '#404049',
          300: '#606067',
          400: '#77777D',
          500: '#8D8D93',
          600: '#A4A4A8',
          700: '#BBBBBE',
          800: '#D2D2D4',
          900: '#E8E8E9'
        }
      }
    },
    fontFamily: {
      mona: 'Mona Sans'
    }
  },
  plugins: [animatedPlugin, aspectRatioPlugin]
}
