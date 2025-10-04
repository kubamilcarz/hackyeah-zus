import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
      },
      colors: {
        'zus-bg': 'rgb(var(--color-bg) / <alpha-value>)',
        'zus-text': 'rgb(var(--color-text) / <alpha-value>)',
        'zus-accent': 'rgb(var(--color-accent) / <alpha-value>)',
        'zus-card': 'rgb(var(--color-card) / <alpha-value>)',
      },
    },
  },
  plugins: [typography],
};

export default config;
