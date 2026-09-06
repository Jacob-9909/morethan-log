/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["selector", '[data-scheme="dark"]'],
  theme: {
    extend: {
      // 값은 src/styles/tailwind.css의 CSS 변수 한 곳에서만 정의한다.
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        elevated: "rgb(var(--elevated) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        subtle: "rgb(var(--subtle) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        "line-strong": "rgb(var(--line-strong) / <alpha-value>)",
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          solid: "rgb(var(--accent-solid) / <alpha-value>)",
          on: "rgb(var(--accent-on) / <alpha-value>)",
          soft: "rgb(var(--accent-soft) / <alpha-value>)",
        },
      },
      // 타입 램프: 11 / 12 / 13 / 15 / 17 / 20 / 24 / 30
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.02em" }],
        xs: ["0.75rem", { lineHeight: "1.125rem" }],
        sm: ["0.8125rem", { lineHeight: "1.375rem" }],
        base: ["0.9375rem", { lineHeight: "1.75" }],
        lg: ["1.0625rem", { lineHeight: "1.7" }],
        xl: ["1.25rem", { lineHeight: "1.4", letterSpacing: "-0.011em" }],
        "2xl": ["1.5rem", { lineHeight: "1.3", letterSpacing: "-0.019em" }],
        "3xl": ["1.875rem", { lineHeight: "1.24", letterSpacing: "-0.023em" }],
      },
      maxWidth: {
        prose: "42rem",
        shell: "56rem",
      },
    },
  },
  plugins: [],
}
