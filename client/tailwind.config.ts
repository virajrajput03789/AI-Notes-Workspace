import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "#141414",
        base: "#0D0D0D",
        accent: "#E8D5A3",
        text: { DEFAULT: "#F5F0E8", muted: "#5A5A5A" }
      },
      fontFamily: {
        serif: ["var(--font-instrument-serif)", "serif"],
        mono: ["var(--font-dm-mono)", "monospace"]
      }
    },
  },
  plugins: [],
};
export default config;
