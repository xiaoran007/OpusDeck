/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#1e1e1e", // App Background
        sidebar: "#141414",    // Sidebar Background
        accent: "#fa233b",     // Classic Red
        border: "#2a2a2a",     // Borders
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      }
    },
  },
  plugins: [],
}
