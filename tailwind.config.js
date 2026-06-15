/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#f5efe6',
        sand: '#ebe1d1',
        terra: '#c08566',
        terradark: '#9c684f',
        sage: '#9caa8b',
        sagedark: '#6f7d62',
        clay: '#a47551',
        rose: '#d4a59a',
        ink: '#3b342d',
      },
      fontFamily: {
        serif: ['Vidaloka', 'serif'],
        sans: ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
