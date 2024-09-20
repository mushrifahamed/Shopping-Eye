/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: '#f7c59f',
        secondary: {
          50: '#d8f3dc',
          100: '#b7e4c7',
          200: '#95d5b2',
          300: '#74c69d',
          400: '#52B788',
          500: '#2d6a4f',
          600: '#1b4332',
          700: '#081c15',
        },
      },
    },
  },
  plugins: [],
}