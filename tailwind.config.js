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
        background: "#F7F5EE", // Primary warm ivory background
        surface: {
          DEFAULT: "#FFFDF8", // Card surface
          secondary: "#FBFAF6", // Secondary surface
          sidebar: "#EFECE4", // Sidebar surface
          hover: "#F3EFE6",
          active: "#EAE5D9"
        },
        navy: {
          900: "#17191C", // Primary text
          800: "#17191C",
          700: "#2B2E33",
          600: "#5F6268"
        },
        slate: {
          50: "#FBFAF6",
          100: "#F7F5EE",
          200: "#E5E1D8",
          300: "#D6D1C5",
          400: "#8B8D91",
          500: "#5F6268",
          600: "#3D4045",
          700: "#2B2E33",
          800: "#1F2125",
          900: "#17191C"
        },
        accent: {
          DEFAULT: "#314B78", // Deep muted indigo / blue
          light: "#F0F4F9",
          border: "#C4D0E3",
          steel: "#657A9C", // Muted steel blue
          indigo: "#314B78"
        },
        forecast: {
          DEFAULT: "#314B78", // Deep muted indigo
          light: "#F0F4F9",
          border: "#657A9C",
          dash: "#657A9C"
        },
        actual: {
          DEFAULT: "#557A62", // Muted dark green
          light: "#F1F5F2",
          border: "#A5BDAC"
        },
        observed: {
          DEFAULT: "#17191C",
          light: "#FBFAF6",
          border: "#D6D1C5"
        },
        warning: {
          DEFAULT: "#B68432", // Muted amber
          light: "#FAF6EF",
          border: "#E2D3B8"
        },
        critical: {
          DEFAULT: "#9A4D48", // Muted dark red
          light: "#F9F2F1",
          border: "#D9BEBC"
        }
      },
      fontFamily: {
        sans: ["Inter", "IBM Plex Sans", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["IBM Plex Mono", "JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"]
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(23, 25, 28, 0.03)",
        card: "0 1px 3px 0 rgba(23, 25, 28, 0.04), 0 1px 2px -1px rgba(23, 25, 28, 0.03)",
        cardHover: "0 4px 12px -2px rgba(23, 25, 28, 0.06), 0 2px 4px -2px rgba(23, 25, 28, 0.03)",
        forecast: "0 0 12px -2px rgba(49, 75, 120, 0.12)"
      }
    },
  },
  plugins: [],
};
