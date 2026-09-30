/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F8FAFC",
        surface: {
          DEFAULT: "#FFFFFF",
          hover: "#F1F5F9",
          active: "#E2E8F0",
          subtle: "#F8FAFC"
        },
        navy: {
          900: "#0B132B",
          800: "#0F172A",
          700: "#1E293B",
          600: "#334155"
        },
        slate: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155"
        },
        accent: {
          DEFAULT: "#2563EB",
          light: "#EFF6FF",
          border: "#BFDBFE",
          indigo: "#4F46E5",
          violet: "#7C3AED"
        },
        forecast: {
          DEFAULT: "#6366F1",
          light: "#EEF2FF",
          border: "#C7D2FE",
          glow: "rgba(99, 102, 241, 0.15)"
        },
        observed: {
          DEFAULT: "#1E293B",
          light: "#F1F5F9",
          border: "#94A3B8"
        },
        warning: {
          DEFAULT: "#D97706",
          light: "#FFFBEB",
          border: "#FDE68A"
        },
        critical: {
          DEFAULT: "#DC2626",
          light: "#FEF2F2",
          border: "#FCA5A5"
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"]
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        card: "0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.04)",
        cardHover: "0 4px 12px -2px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.04)",
        forecast: "0 0 16px -2px rgba(99, 102, 241, 0.25)"
      }
    },
  },
  plugins: [],
};
