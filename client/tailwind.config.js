/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },

      colors: {
        bg: "#0B1220",        // primary background (deep navy)
        surface: "#111C2E",   // secondary background
        card: "#162235",      // cards / panels

        primary: "#3B82F6",   // blue highlight
        accent: "#22D3EE",    // cyan glow

        text: "#E5E7EB",      // main text
        muted: "#94A3B8",     // secondary text
      },
    },
  },
  plugins: [],
}