/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        neon: "0 0 0 1px rgba(236,72,153,.12), 0 16px 50px rgba(0,0,0,.55)",
        card: "0 20px 70px rgba(0,0,0,.55)"
      },
      borderRadius: { panel: "28px" }
    },
  },
  plugins: [],
}
