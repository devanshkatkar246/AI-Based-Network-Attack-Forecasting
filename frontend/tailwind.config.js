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
        background: "#0B0E12", // Application background
        surface: {
          DEFAULT: "#151A21", // Primary surface
          secondary: "#191F27", // Secondary surface
          sidebar: "#10141A", // Sidebar background
          elevated: "#1D232C", // Elevated surface
          hover: "#1D232C",
          active: "#252D38"
        },
        navy: {
          900: "#E7EBF0", // Primary text
          800: "#E7EBF0",
          700: "#A7B0BC",
          600: "#737D89"
        },
        slate: {
          50: "#10141A",
          100: "#151A21",
          200: "#191F27",
          300: "#1D232C",
          400: "#2A323D",
          500: "#737D89",
          600: "#A7B0BC",
          700: "#A7B0BC",
          800: "#151A21",
          900: "#10141A",
          950: "#0B0E12"
        },
        accent: {
          DEFAULT: "#7898C7", // Indigo / Blue accent
          light: "#192333",
          border: "#35404D",
          steel: "#7898C7",
          indigo: "#7898C7"
        },
        forecast: {
          DEFAULT: "#7898C7",
          light: "#192333",
          border: "#35404D",
          dash: "#7898C7"
        },
        actual: {
          DEFAULT: "#6D9278", // Muted green
          light: "#19261E",
          border: "#354D3D"
        },
        observed: {
          DEFAULT: "#A7B0BC",
          light: "#151A21",
          border: "#2A323D"
        },
        warning: {
          DEFAULT: "#B58A43", // Muted amber
          light: "#292116",
          border: "#4D3A1F"
        },
        critical: {
          DEFAULT: "#A85D59", // Muted dark red
          light: "#291919",
          border: "#4D2525"
        }
      },
      fontFamily: {
        sans: ["Inter", "IBM Plex Sans", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["IBM Plex Mono", "JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"]
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.3)",
        cardHover: "0 4px 12px -2px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.3)",
        forecast: "0 0 12px -2px rgba(120, 152, 199, 0.15)"
      }
    },
  },
  plugins: [],
};

