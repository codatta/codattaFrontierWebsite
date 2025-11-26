/** @type {import('tailwindcss').Config} */
import animatedPlugin from 'tailwindcss-animated'
import aspectRatioPlugin from '@tailwindcss/aspect-ratio'
import typographyPlugin from '@tailwindcss/typography'

module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'dot-expand': 'dot-expand 1.5s infinite ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      },
      keyframes: {
        'dot-expand': {
          '0%, 80%, 100%': {
            opacity: 0,
            transform: 'scale(0.2)'
          },
          '40%': {
            opacity: 1,
            transform: 'scale(1)'
          }
        },
        'fade-in': {
          '0%': {
            opacity: 0
          },
          '100%': {
            opacity: 1
          }
        },
        'scale-in': {
          '0%': {
            opacity: 0,
            transform: 'translate(-50%, -50%) scale(0.9)'
          },
          '100%': {
            opacity: 1,
            transform: 'translate(-50%, -50%) scale(1)'
          }
        }
      },
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
    },
    boxShadow: {
      'app-btn': `
          inset 1px 1px 1px rgba(255, 255, 255, 0.8),
          inset -1px -1px 0.5px rgba(255, 255, 255, 0.4),
          1px 1px 10px rgba(60, 60, 0, 0.05),
          0px 0px 8px rgba(60, 60, 0, 0.05)
      `
    }
  },
  plugins: [animatedPlugin, aspectRatioPlugin, typographyPlugin]
}
