/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4E8054",
          50: "#F3FAF4",
          100: "#DCEEDE",
          600: "#4E8054",
          700: "#427048",
          800: "#365C3B",
        },
        sidebar: "#F9FAFB",
        surface: "#FFFFFF",
        hairline: "#E5E7EB",
        ink: {
          DEFAULT: "#111827",
          muted: "#6B7280",
          soft: "#9CA3AF",
        },
        status: {
          awaiting: "#B42318",
          awaitingBg: "#FFE9EE",
          active: "#1A5F6B",
          activeBg: "#E8F2F4",
          completed: "#157A3A",
          completedBg: "#E7F6EC",
          warning: "#B45309",
          warningBg: "#FEF3C7",
        },
        accentLav: "#C9C2F2",
        accentGreen: "#B7E4C7",
        accentAmber: "#FBD38D",
        doc: {
          rose: "#FFF1F2",
          indigo: "#EEF0FE",
          cream: "#FFFBEB",
        },
        leadsBar: {
          /** Light sage wash — green-tinted, not yellow */
          bg: "#F2F8F3",
        },
        swatch: {
          charcoal: "#292929",
          forest: "#4E8054",
          mint: "#B8D4BC",
        },
        chart: {
          primary: "#124553",
          lavender: "#3D5A80",
          amber: "#2A9D8F",
          mint: "#52B788",
          grid: "#E5E7EB",
          tick: "#6B7280",
        },
      },
      fontFamily: {
        sans: [
          "Helvetica",
          "Helvetica Neue",
          "Arial",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
      },
      borderRadius: {
        md: "6px",
        lg: "8px",
        xl: "8px",
        "2xl": "10px",
      },
      boxShadow: {
        card: "none",
        pop: "0 8px 24px rgba(16, 24, 40, 0.12)",
      },
      spacing: {
        section: "16px",
      },
    },
  },
  plugins: [],
};
