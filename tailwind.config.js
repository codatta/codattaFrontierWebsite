/** @type {import('tailwindcss').Config} */
import animatedPlugin from 'tailwindcss-animated'
import formPlugin from '@tailwindcss/forms'
import aspectRatioPlugin from '@tailwindcss/aspect-ratio'

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {},
  plugins: [animatedPlugin, formPlugin, aspectRatioPlugin]
}
