/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Apple Music Dark Mode inspired palette
        'app-bg': '#1e1e1e', // Slightly lighter than pure black for depth
        'app-sidebar': '#141414', // Darker sidebar
        'app-divider': '#2a2a2a',
        'accent': '#fa233b', // Classic AM Red
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      }
    },
  },
  plugins: [],
}
