/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["selector", '[data-scheme="dark"]'],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#0d9488",
          light: "#14b8a6",
          dark: "#0f766e",
        },
      },
    },
  },
  plugins: [],
}
