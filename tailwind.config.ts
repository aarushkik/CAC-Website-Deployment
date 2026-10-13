import type { Config } from "tailwindcss";

/**
 * FixIt WA 03 theme.
 * Palette is workshop-inspired: warm wood/kraft tones, a trustworthy blue,
 * and clear green/yellow/red for the safety results.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand / trust and the warm workshop tones. The numbers live in globals.css,
        // once for light and once for dark.
        brand: {
          50: "rgb(var(--b-50) / <alpha-value>)",
          100: "rgb(var(--b-100) / <alpha-value>)",
          200: "rgb(var(--b-200) / <alpha-value>)",
          300: "rgb(var(--b-300) / <alpha-value>)",
          400: "rgb(var(--b-400) / <alpha-value>)",
          500: "rgb(var(--b-500) / <alpha-value>)",
          600: "rgb(var(--b-600) / <alpha-value>)",
          700: "rgb(var(--b-700) / <alpha-value>)",
          800: "rgb(var(--b-800) / <alpha-value>)",
          900: "rgb(var(--b-900) / <alpha-value>)",
        },
        workshop: {
          50: "rgb(var(--w-50) / <alpha-value>)",
          100: "rgb(var(--w-100) / <alpha-value>)",
          200: "rgb(var(--w-200) / <alpha-value>)",
          300: "rgb(var(--w-300) / <alpha-value>)",
          500: "rgb(var(--w-500) / <alpha-value>)",
          600: "rgb(var(--w-600) / <alpha-value>)",
          800: "rgb(var(--w-800) / <alpha-value>)",
          900: "rgb(var(--w-900) / <alpha-value>)",
        },
        surface: "rgb(var(--surface) / <alpha-value>)",
        // Safety signal colors
        safe: "#16a34a",
        caution: "#d97706",
        danger: "#dc2626",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "1rem",
      },
      boxShadow: {
        card: "4px 4px 0 0 rgb(var(--w-200))",
        lift: "6px 6px 0 0 rgb(var(--w-300))",
      },
      keyframes: {
        rise: { from: { opacity: "0", transform: "translateY(10px)" }, to: { opacity: "1", transform: "none" } },
        pop: { "0%": { transform: "scale(.9)", opacity: "0" }, "100%": { transform: "none", opacity: "1" } },
      },
      animation: {
        rise: "rise .35s cubic-bezier(.2,.8,.2,1) both",
        pop: "pop .25s cubic-bezier(.3,1.3,.5,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
