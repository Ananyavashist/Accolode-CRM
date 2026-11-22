/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#124553",
          50: "#E9F3F5",
          100: "#C5DDE3",
          600: "#124553",
          700: "#0E3A45",
          800: "#0A2E38",
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
          active: "#124553",
          activeBg: "#E9F3F5",
          completed: "#157A3A",
          completedBg: "#E7F6EC",
          warning: "#B45309",
          warningBg: "#FEF3C7",
        },
        accentLav: "#C9C2F2",
        accentGreen: "#C5DDE3",
        accentAmber: "#FBD38D",
        doc: {
          rose: "#FFF1F2",
          indigo: "#EEF0FE",
          cream: "#FFFBEB",
        },
        leadsBar: {
          /** Light teal wash aligned with logo primary */
          bg: "#E9F3F5",
        },
        swatch: {
          charcoal: "#292929",
          forest: "#124553",
          mint: "#7EB8C4",
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
