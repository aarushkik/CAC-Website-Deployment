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
        // ── Bold Vivid Palette ──
        "vivid-pink": {
          50: "#fdf2f8",
          100: "#fce7f3",
          200: "#fbcfe8",
          300: "#f9a8d4",
          400: "#f472b6",
          500: "#ec4899",
          600: "#db2777",
          700: "#be185d",
        },
        "electric-blue": {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        "neon-lime": {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
        },
        "deep-purple": {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7e22ce",
        },
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
        // ── New Vivid Animations ──
        springBounce: {
          "0%": { transform: "scale(1)" },
          "30%": { transform: "scale(0.92)" },
          "50%": { transform: "scale(1.08)" },
          "70%": { transform: "scale(0.96)" },
          "100%": { transform: "scale(1)" },
        },
        jelly: {
          "0%": { transform: "scale(1, 1)" },
          "25%": { transform: "scale(0.9, 1.1)" },
          "50%": { transform: "scale(1.1, 0.9)" },
          "75%": { transform: "scale(0.95, 1.05)" },
          "100%": { transform: "scale(1, 1)" },
        },
        popIn: {
          "0%": { opacity: "0", transform: "scale(0.5) rotate(-8deg)" },
          "60%": { opacity: "1", transform: "scale(1.1) rotate(2deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(0deg)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        gradientShift: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        colorBreathe: {
          "0%, 100%": { borderColor: "#f97316" },
          "25%": { borderColor: "#ec4899" },
          "50%": { borderColor: "#3b82f6" },
          "75%": { borderColor: "#a855f7" },
        },
        glowPulseHeavy: {
          "0%, 100%": { boxShadow: "0 0 15px rgba(249, 115, 22, 0.3), 0 0 40px rgba(249, 115, 22, 0.1)" },
          "50%": { boxShadow: "0 0 30px rgba(236, 72, 153, 0.4), 0 0 60px rgba(236, 72, 153, 0.15)" },
        },
        tiltHover: {
          "0%, 100%": { transform: "perspective(500px) rotateY(0deg) rotateX(0deg)" },
          "50%": { transform: "perspective(500px) rotateY(3deg) rotateX(-2deg)" },
        },
        lookAround: {
          "0%, 100%": { transform: "translate(0, 0) scale(1) rotate(0deg)" },
          "20%": { transform: "translate(-6px, 2px) scale(1.02) rotate(-5deg)" },
          "40%": { transform: "translate(6px, -2px) scale(0.98) rotate(5deg)" },
          "60%": { transform: "translate(-3px, -4px) scale(1.04) rotate(-2deg)" },
          "80%": { transform: "translate(3px, 4px) scale(1.01) rotate(3deg)" },
        },
        pageShootUp: {
          "0%": { opacity: "0", transform: "translateY(50px) scale(0.97)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
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
        // ── New Vivid Animation Utilities ──
        "spring-bounce": "springBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        jelly: "jelly 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "pop-in": "popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "pop-in-delay-1": "popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s forwards",
        "pop-in-delay-2": "popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s forwards",
        "pop-in-delay-3": "popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s forwards",
        "pop-in-delay-4": "popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s forwards",
        "slide-in-left": "slideInLeft 0.5s ease-out forwards",
        "slide-in-right": "slideInRight 0.5s ease-out forwards",
        "gradient-shift": "gradientShift 4s ease infinite",
        "color-breathe": "colorBreathe 4s ease-in-out infinite",
        "glow-pulse-heavy": "glowPulseHeavy 3s ease-in-out infinite",
        "tilt-hover": "tiltHover 3s ease-in-out infinite",
        "look-around": "lookAround 3s ease-in-out infinite",
        "page-shoot-up": "pageShootUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
