import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1976D2",
          50: "#E8F1FB",
          100: "#D1E3F7",
          200: "#A3C7EF",
          300: "#75ABE7",
          400: "#478EDB",
          500: "#1976D2",
          600: "#135CAA",
          700: "#0E4381",
          800: "#082A59",
          900: "#031130"
        }
      },
      boxShadow: {
        card: "0 10px 25px -10px rgba(0,0,0,0.25)",
      },
      borderRadius: {
        xl: "1rem"
      }
    }
  },
  plugins: []
};

export default config; 