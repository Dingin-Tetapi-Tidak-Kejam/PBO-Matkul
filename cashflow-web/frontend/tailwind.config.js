/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
      },
      colors: {
        dark: {
          50:  '#f0f0f5',
          100: '#d0d0e0',
          200: '#a0a0c0',
          300: '#7070a0',
          400: '#505080',
          500: '#303060',
          600: '#202050',
          700: '#18182a',
          800: '#111118',
          900: '#0a0a0f',
        },
        accent: {
          green:  '#63cf8b',
          red:    '#ff6b7a',
          blue:   '#5b9cf6',
          yellow: '#f5c842',
          purple: '#a78bfa',
        },
      },
    },
  },
  plugins: [],
}
