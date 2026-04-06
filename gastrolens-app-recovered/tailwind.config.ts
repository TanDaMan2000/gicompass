import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        shell: "#f4fbfd",
        ink: "#15354a",
        muted: "#537187",
        line: "rgba(34, 96, 126, 0.12)",
        primary: "#0f9bb3",
        "primary-dark": "#0f6d88",
        accent: "#69d5d2",
        low: "#1f9d67",
        moderate: "#d1a128",
        high: "#d65757",
      },
      fontFamily: {
        heading: ["Manrope", "sans-serif"],
        body: ["Plus Jakarta Sans", "sans-serif"],
      },
      boxShadow: {
        soft: "0 30px 80px rgba(21, 53, 74, 0.12)",
        glow: "0 20px 50px rgba(15, 109, 136, 0.16)",
      },
      borderRadius: {
        shell: "32px",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fadeUp 320ms ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
