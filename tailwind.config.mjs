/** @type {import('tailwindcss').Config} */
import animatedPlugin from 'tailwindcss-animated'
import aspectRatioPlugin from '@tailwindcss/aspect-ratio'

module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    // boxShadow: {
    //   DEFAULT: '0px 4px 8px 0px #875DFF1A, 0px 14px 14px 0px #875DFF17'
    // },
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
      },
      keyframes: {
        uneZoomIn: {
          '0%': {
            opacity: 0,
            transform: 'scale3d(0.3, 0.3, 0.3)'
          },
          '50%': {
            opacity: 1
          }
        },
        uneZoomOut: {
          '0%': {
            opacity: 1
          },
          '50%': {
            transform: 'scale3d(0.3, 0.3, 0.3)'
          },
          '50%,to': {
            opacity: 0
          }
        }
      }
    },
    fontFamily: {
      mona: 'Mona Sans'
    }
  },
  plugins: [animatedPlugin, aspectRatioPlugin]
}
