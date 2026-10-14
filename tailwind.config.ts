import type { Config } from "tailwindcss";

/**
 * FixIt WA 03 theme.
 *
 * The look is a Washington workshop: Pacific Northwest overcast grays, white
 * work surfaces, "blueprint" blue for actions, manila repair tags, and an
 * evergreen landscape (mist and fir) used only for illustration.
 * Green / yellow / red are the ANSI Z535 safety colors used on real safety
 * signs, and they are reserved for safety meaning only — never decoration.
 * (Blue is ANSI's informational color, which is why actions use it.)
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Text: carpenter-pencil graphite.
        ink: {
          DEFAULT: "#1c2321",
          soft: "#3d4743",
          muted: "#56605c",
        },
        // Backgrounds and hairlines: Pacific Northwest overcast.
        concrete: {
          50: "#f5f7f8",
          100: "#ebf0f2",
          200: "#dde4e8",
          300: "#c8d2d7",
          400: "#a3b1b8",
        },
        // Washington landscape illustration only — never for safety meaning.
        mist: {
          200: "#d3dee3",
          300: "#b6c7cf",
          400: "#93a9b3",
          500: "#6f8893",
        },
        fir: {
          500: "#3f6350",
          700: "#24402f",
          800: "#1b3125",
          900: "#13231a",
        },
        // Actions and links: blueprint blue (ANSI "notice" blue family).
        brand: {
          50: "#ebf1f9",
          100: "#d4e1f2",
          200: "#a9c2e4",
          500: "#2f63ae",
          600: "#1d4f91",
          700: "#163e73",
          800: "#102e56",
        },
        // Repair tags.
        manila: {
          100: "#f7eedb",
          200: "#ecdcb5",
          300: "#dfc690",
          700: "#6e5422",
        },
        // ANSI safety colors. DEFAULT is the sign color; `ink` is the
        // darker shade that passes WCAG AA as text on white or `soft`.
        safe: {
          DEFAULT: "#007a53",
          ink: "#00603f",
          soft: "#e2f2ea",
        },
        caution: {
          DEFAULT: "#ffd100",
          ink: "#6b5300",
          soft: "#fff5c7",
        },
        danger: {
          DEFAULT: "#c8102e",
          ink: "#a00d25",
          soft: "#fbe6e9",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "0.875rem",
      },
      boxShadow: {
        card: "0 1px 0 rgba(28, 35, 33, 0.04), 0 1px 3px rgba(28, 35, 33, 0.06)",
        lift: "0 2px 0 rgba(28, 35, 33, 0.04), 0 8px 24px -8px rgba(28, 35, 33, 0.18)",
      },
      keyframes: {
        "sign-in": {
          "0%": { opacity: "0", transform: "translateY(6px) rotate(-0.6deg)" },
          "100%": { opacity: "1", transform: "translateY(0) rotate(0)" },
        },
        "toast-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "sign-in": "sign-in 380ms cubic-bezier(0.2, 0.8, 0.2, 1) both",
        "toast-in": "toast-in 200ms ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
