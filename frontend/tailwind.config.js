/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0D1B2A",
        gold: {
          DEFAULT: "#C9A96E",
          light: "#E8D5B0",
        },
        cream: "#F7F3EE",
        slate: {
          custom: "#4A5568",
        },
        success: "#2D6A4F",
        error: "#C0392B",
      },
      fontFamily: {
        display: ['"Playfair Display"', "serif"],
        sans: ['Inter', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
