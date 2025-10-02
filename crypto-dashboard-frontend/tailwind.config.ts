import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // ✅ toggle dark mode via class
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    },
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0f172a",   // dark background (navy)
          light: "#1e293b",     // lighter background
          accent: "#22d3ee",    // cyan accent
          success: "#10b981",   // green for positive change
          danger: "#ef4444",    // red for negative change
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        mono: ["JetBrains Mono", "monospace"], // for numbers/tickers
      },
      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.15)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"), // ✅ better text defaults
  ],
};

export default config;
