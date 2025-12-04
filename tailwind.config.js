/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        // Override Tailwind's default `rose` palette with softer, pastel values
        rose: {
          50:  '#fff9fb',
          100: '#fff1f5',
          200: '#ffe6ee',
          300: '#ffd6e6',
          400: '#ffc6db',
          500: '#ffb3cf',
          600: '#ff9fbd',
          700: '#ff88aa',
          800: '#ff6f95',
          900: '#ff527a',
        }
      }
    },
  },
  plugins: [],
}