/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        primary: '#2E7D32',
        secondary: '#1976D2'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
