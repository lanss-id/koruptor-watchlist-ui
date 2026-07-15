/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: { 900: '#0a0a0a', 800: '#171717', 700: '#262626', 600: '#404040', 500: '#737373', 400: '#a3a3a3' },
        accent: '#dc2626',
      },
      fontFamily: {
        sans: ['Inter Tight', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
