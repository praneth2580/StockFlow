/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // 'media' or 'class'
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        spinSlow: "spin 1.2s linear infinite",
        pingSlow: "ping 2.2s cubic-bezier(0, 0, 0.2, 1) infinite",
        fadeIn: "fadeIn 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        }
      }
    }
  },
  plugins: [],
}