/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "c-bg":             "rgb(var(--c-bg) / <alpha-value>)",
        "c-card":           "rgb(var(--c-card) / <alpha-value>)",
        "c-card-alt":       "rgb(var(--c-card-alt) / <alpha-value>)",
        "c-text":           "rgb(var(--c-text) / <alpha-value>)",
        "c-text-secondary": "rgb(var(--c-text-secondary) / <alpha-value>)",
        "c-text-tertiary":  "rgb(var(--c-text-tertiary) / <alpha-value>)",
        "c-separator":      "rgb(var(--c-separator) / <alpha-value>)",
        "c-blue":           "rgb(var(--c-blue) / <alpha-value>)",
        "c-blue-soft":      "rgb(var(--c-blue-soft) / <alpha-value>)",
        "c-green":          "rgb(var(--c-green) / <alpha-value>)",
        "c-green-soft":     "rgb(var(--c-green-soft) / <alpha-value>)",
        "c-red":            "rgb(var(--c-red) / <alpha-value>)",
        "c-orange":         "rgb(var(--c-orange) / <alpha-value>)",
        "c-orange-soft":    "rgb(var(--c-orange-soft) / <alpha-value>)",
        "c-purple":         "rgb(var(--c-purple) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};
