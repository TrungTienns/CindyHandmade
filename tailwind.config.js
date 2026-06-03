/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-green': '#3b4d3d',
        'brand-pink': '#e57399',
      },
      fontFamily: {
        'great-vibes': ['"Great Vibes"', 'cursive'],
        'outfit': ['"Outfit"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
