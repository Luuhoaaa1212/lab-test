/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ["./src/**/*.{html,ts}", "./node_modules/flowbite/**/*.js"],
  prefix: 'tw-',
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        'primary':'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px',
        'hover':'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;'
      }
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'color-bg-lg':'#FFF',
      'white': '#ffffff',
      'black': '#000',
      'color-placholder':'rgba(0, 0, 0, 0.40)',
      'color-bg': '#F0F0F0',
      'color-star': '#FFC633',
      'color-bg-sales' : 'rgba(255, 51, 51, 0.10)',
      'color-text-sales': '#FF3333',
      'color-item-bg' : '#F0EEED',
      'color-text-feedback': 'rgba(0, 0, 0, 0.60)',
      'color-border': 'rgba(0, 0, 0, 0.10)',
      'color-bg-btn':'#F0F0F0',
      
    },
  },
  plugins: [require('flowbite/plugin')],
}

