/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#121421',
        secondary: '#D4AF37',
        accent: '#1F2937',
        'gold': '#D4AF37',
        'dark-gray': '#1F2937',
        'light-gray': '#F8FAFC',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      flex: {
        '2': '2 2 0%',
      },
      screens: {
        '3xl': '1600px',
      },
    },
  },
  plugins: [],
};
