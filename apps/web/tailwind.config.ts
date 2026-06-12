import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F5F7FB",
        surface: "#FFFFFF",
        "surface-soft": "#F8FAFC",
        border: "rgba(15, 23, 42, 0.08)",
        "text-primary": "#0F172A",
        "text-secondary": "#475569",
        "text-muted": "#64748B",
        "text-heading": "#0F172A",
        primary: "#0F172A",
        "primary-hover": "#020617",
        accent: "#4F46E5",
        "accent-hover": "#4338CA",
        "accent-soft": "#EEF2FF",
        success: "#059669",
        warning: "#D97706",
        error: "#DC2626",
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15, 23, 42, 0.04), 0 12px 32px rgba(15, 23, 42, 0.06)",
        card: "0 4px 6px rgba(15, 23, 42, 0.04), 0 20px 48px rgba(15, 23, 42, 0.08)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
