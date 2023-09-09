/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    
    extend: {
      fontFamily: {
        'corbel': ['Corbel', 'sans-serif']
      }
    },
  },
  plugins: [],
}

