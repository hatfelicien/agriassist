/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#22c55e',
        secondary: '#16a34a',
        accent: '#fbbf24'
      },
      fontSize: {
        'touch': '1.125rem'
      },
      spacing: {
        'touch': '3rem'
      }
    }
  },
  plugins: []
};
