/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#124553",
          50: "#eef5f7",
          100: "#d3e3e8",
          600: "#124553",
          700: "#0e3743",
          800: "#0a2932",
        },
        sidebar: "#FBFBFB",
        surface: "#FFFFFF",
        hairline: "#F3F2F2",
        ink: {
          DEFAULT: "#1A1D1F",
          muted: "#6B7280",
          soft: "#9AA1A9",
        },
        status: {
          awaiting: "#E11D48",
          awaitingBg: "#FFE9EE",
          active: "#6366F1",
          activeBg: "#EEF0FE",
          completed: "#16A34A",
          completedBg: "#E7F6EC",
        },
        accentLav: "#C9C2F2",
        accentGreen: "#B7E4C7",
        accentAmber: "#FBD38D",
        doc: {
          rose: "#FFF1F2",
          indigo: "#EEF0FE",
          cream: "#FFFBEB",
        },
        chart: {
          primary: "#124553",
          lavender: "#C9C2F2",
          amber: "#FBD38D",
          mint: "#B7E4C7",
          grid: "#F1F1F1",
          tick: "#9AA1A9",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      borderRadius: {
        md: "10px",
        lg: "10px",
        xl: "10px",
        "2xl": "10px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(16, 24, 40, 0.04)",
        pop: "0 8px 24px rgba(16, 24, 40, 0.12)",
      },
      spacing: {
        section: "10px",
      },
    },
  },
  plugins: [],
};
