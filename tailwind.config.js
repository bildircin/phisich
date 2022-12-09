/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'tablet': '640px',
      },
      minHeight: {
        '400px': '400px'
      },
      colors: {
        'custom-yellow': '#FBBD17'
      }
    }
  },
  plugins: [],
}
