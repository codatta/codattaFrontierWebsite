/** @type {import('tailwindcss').Config} */
import animatedPlugin from 'tailwindcss-animated'
import aspectRatioPlugin from '@tailwindcss/aspect-ratio'

module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#875DFF'
        },
        success: {
          DEFAULT: '#5DDD22'
        },
        error: {
          DEFAULT: '#D92B2B'
        },
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
      mona: 'Mona Sans',
      zendots: 'Zen Dots'
    }
  },
  plugins: [animatedPlugin, aspectRatioPlugin]
}
