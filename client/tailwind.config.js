export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#07090e",
          card: "#0f1523",
          cardHover: "#162035",
          border: "#1e293b",
          borderLight: "#334155",
          cyan: "#00f5ff",
          purple: "#9333ea",
          pink: "#ec4899",
          amber: "#f59e0b",
          emerald: "#10b981",
        },
      },
      boxShadow: {
        "neon-cyan": "0 0 15px rgba(0, 245, 255, 0.35)",
        "neon-purple": "0 0 15px rgba(147, 51, 234, 0.4)",
        "neon-pink": "0 0 15px rgba(236, 72, 153, 0.4)",
        "3d-card":
          "0 20px 35px -10px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 245, 255, 0.12)",
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', '"Plus Jakarta Sans"', "sans-serif"],
        display: ['"Outfit"', '"Be Vietnam Pro"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
