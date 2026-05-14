/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        appbg: "#171918",
        card: "#1F2221",
        border: "#2C3130",
        muted: "#A7B0AD",
        text: "#E9EFED",
        xpgreen: "#2CE6A6",
        xpred: "#FF5A6A",
        xpamber: "#FFCC66",
      },
      boxShadow: {
        soft: "0 12px 30px rgba(0,0,0,.35)",
      },
    },
  },
  plugins: [],
};
