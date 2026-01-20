
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#050505",
        surface: "#121212",
        accent: "#FFFFFF",
        "accent-contrast": "#000000",
        subtle: "#1C1C1E",
        text: "#F5F5F7",
        secondary: "#86868B",
        border: "rgba(255, 255, 255, 0.08)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
      },
      fontSize: {
        'nano': ['clamp(0.81rem, 0.6vw, 0.88rem)', { lineHeight: '1.4', letterSpacing: '0.12em' }],
        'body-fluid': ['clamp(1.06rem, 1.2vw, 1.15rem)', { lineHeight: '1.6', letterSpacing: '-0.01em' }],
        'label-fluid': ['clamp(0.85rem, 0.7vw, 0.95rem)', { lineHeight: '1.2', letterSpacing: '0.2em' }],
        'h1-fluid': ['clamp(3.2rem, 7vw, 5.8rem)', { lineHeight: '0.92', letterSpacing: '-0.04em' }],
        'h2-fluid': ['clamp(2.6rem, 5.5vw, 4.8rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        'h3-fluid': ['clamp(1.4rem, 2.5vw, 2.1rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'card-title-fluid': ['clamp(1.5rem, 2.2vw, 2.1rem)', { lineHeight: '1', letterSpacing: '-0.02em' }],
      },
      letterSpacing: {
        'widest-2x': '0.3em',
        'widest-3x': '0.45em',
      }
    },
  },
  plugins: [],
}
