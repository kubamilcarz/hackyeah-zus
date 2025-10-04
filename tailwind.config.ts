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
        "bookie-bg": "rgb(var(--bookie-bg) / <alpha-value>)",
        "bookie-orange": "rgb(var(--bookie-orange) / <alpha-value>)",
      },
    },
  },
  plugins: [typography],
};

export default config;
