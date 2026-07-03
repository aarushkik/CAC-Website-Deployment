import type { Config } from "tailwindcss";

/**
 * RepairBuddy theme.
 * Dark mode with amber/orange accents matching the hamster mascot.
 * Glassmorphism-ready, with rich animation keyframes.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Dark backgrounds
        dark: {
          950: "#06060a",
          900: "#0a0a0f",
          800: "#111118",
          700: "#1a1a25",
          600: "#232333",
          500: "#2d2d42",
        },
        // Primary accent — amber/orange (matches mascot)
        accent: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f59e0b",
          600: "#ea580c",
          700: "#c2410c",
        },
        // Safety signal colors (vibrant on dark)
        safe: "#10b981",
        caution: "#f59e0b",
        danger: "#f43f5e",
        // Glass / overlay
        glass: {
          light: "rgba(255, 255, 255, 0.05)",
          medium: "rgba(255, 255, 255, 0.08)",
          heavy: "rgba(255, 255, 255, 0.12)",
          border: "rgba(255, 255, 255, 0.1)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "1rem",
        "card-lg": "1.25rem",
      },
      boxShadow: {
        glow: "0 0 20px rgba(245, 158, 11, 0.15)",
        "glow-md": "0 0 30px rgba(245, 158, 11, 0.25)",
        "glow-lg": "0 0 50px rgba(245, 158, 11, 0.3)",
        "glow-safe": "0 0 20px rgba(16, 185, 129, 0.2)",
        "glow-danger": "0 0 20px rgba(244, 63, 94, 0.2)",
        "glow-caution": "0 0 20px rgba(245, 158, 11, 0.2)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.3)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        bounceIn: {
          "0%": { opacity: "0", transform: "scale(0.3)" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 5px rgba(245, 158, 11, 0.2)" },
          "50%": { boxShadow: "0 0 20px rgba(245, 158, 11, 0.4)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-2deg)" },
          "75%": { transform: "rotate(2deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "speech-in": {
          "0%": { opacity: "0", transform: "scale(0.8) translateY(10px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        pageEnter: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        ripple: {
          "0%": { transform: "scale(0)", opacity: "0.5" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 8px rgba(245, 158, 11, 0.1), inset 0 0 8px rgba(245, 158, 11, 0.05)" },
          "50%": { boxShadow: "0 0 24px rgba(245, 158, 11, 0.25), inset 0 0 12px rgba(245, 158, 11, 0.1)" },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "float-slow": "float-slow 4s ease-in-out infinite",
        "float-delay": "float 3s ease-in-out 0.5s infinite",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "slide-up-delay-1": "slideUp 0.5s ease-out 0.1s forwards",
        "slide-up-delay-2": "slideUp 0.5s ease-out 0.2s forwards",
        "slide-up-delay-3": "slideUp 0.5s ease-out 0.3s forwards",
        "slide-up-delay-4": "slideUp 0.5s ease-out 0.4s forwards",
        "slide-down": "slideDown 0.3s ease-out forwards",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "fade-in-delay-1": "fadeIn 0.5s ease-out 0.15s forwards",
        "fade-in-delay-2": "fadeIn 0.5s ease-out 0.3s forwards",
        "fade-in-delay-3": "fadeIn 0.5s ease-out 0.45s forwards",
        "scale-in": "scaleIn 0.4s ease-out forwards",
        "bounce-in": "bounceIn 0.6s ease-out forwards",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        wiggle: "wiggle 0.5s ease-in-out",
        shimmer: "shimmer 2s linear infinite",
        "speech-in": "speech-in 0.4s ease-out 0.3s forwards",
        "page-enter": "pageEnter 0.4s ease-out forwards",
        ripple: "ripple 0.6s ease-out",
        "glow-pulse": "glowPulse 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
