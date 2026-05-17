import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4A7C59",
          dark: "#2F5233",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#D97757",
          foreground: "#FFFFFF",
        },
        background: "#FAF7F2",
        surface: "#FFFFFF",
        "text-dark": "#1F2A24",
        "text-muted": "#6B7B73",
        border: "#E5E0D5",
        "sun-yellow": "#F5C84C",
        "shade-blue": "#A8C5D6",
        sage: {
          50: "#f0f7f2",
          100: "#d9ece0",
          200: "#b5d9c3",
          300: "#85be9e",
          400: "#4A7C59",
          500: "#3d6a4a",
          600: "#2F5233",
          700: "#274430",
          800: "#1f3526",
          900: "#182b1e",
        },
      },
      fontFamily: {
        sans: ["Inter", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        heading: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 2px 8px 0 rgba(31,42,36,0.06)",
        card: "0 4px 16px 0 rgba(31,42,36,0.08)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(-10px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
