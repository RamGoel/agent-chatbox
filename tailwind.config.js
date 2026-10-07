/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx}"],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        ak: {
          border: "var(--ak-border)",
          "border-hover": "var(--ak-border-hover)",
          surface: "var(--ak-surface)",
          "surface-hover": "var(--ak-surface-hover)",
          "surface-active": "var(--ak-surface-active)",
          primary: "var(--ak-primary)",
          "primary-hover": "var(--ak-primary-hover)",
          "primary-content": "var(--ak-primary-content)",
          danger: "var(--ak-danger)",
          "danger-hover": "var(--ak-danger-hover)",
          content: "var(--ak-content)",
          "content-secondary": "var(--ak-content-secondary)",
          "content-tertiary": "var(--ak-content-tertiary)",
        },
      },
      fontFamily: {
        sans: ["var(--ak-font-sans, system-ui)", "sans-serif"],
        mono: ["var(--ak-font-mono, monospace)"],
      },
    },
  },
  plugins: [],
};
