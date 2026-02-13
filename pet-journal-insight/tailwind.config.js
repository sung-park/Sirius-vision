/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#6200EA',
          light: '#7C4DFF',
          dark: '#4A00B0',
        },
        score: {
          high: '#10B981',
          mid: '#F59E0B',
          low: '#E11D48',
        },
        surface: {
          DEFAULT: '#1A1A2E',
          card: '#16213E',
          elevated: '#0F3460',
        }
      },
    },
  },
  plugins: [],
}
