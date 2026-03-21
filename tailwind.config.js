/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'audit-navy': '#0C1B33',
        'audit-gold': '#C9A84C',
        'border': '#e2e8f0', // definindo a cor border
      },
    },
  },
  plugins: [],
}