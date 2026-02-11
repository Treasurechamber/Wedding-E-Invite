import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#050816",
          800: "#0b1020",
        },
        champagne: {
          50: "#fffaf3",
          100: "#fdf3e5",
        },
        gold: {
          300: "#f9e3a0",
          400: "#f3cf6b",
          500: "#e7b947",
        },
      },
      fontFamily: {
        script: ["var(--font-great-vibes)"],
        serif: ["var(--font-cormorant)"],
        sans: ["var(--font-raleway)"],
      },
    },
  },
  plugins: [],
};

export default config;

