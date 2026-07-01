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
        // Brand / trust
        brand: {
          50: "#eef6ff",
          100: "#d9ebff",
          500: "#2563eb",
          600: "#1d4ed8",
          700: "#1e40af",
        },
        // Warm workshop background tones
        workshop: {
          50: "#faf7f2",
          100: "#f3ece1",
          200: "#e6d9c6",
          800: "#463b2e",
          900: "#2f271d",
        },
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
    },
  },
  plugins: [],
};

export default config;
