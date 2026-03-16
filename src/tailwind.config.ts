module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0f3b4d",
        "accent-blue": "#1c5d75",
        coral: "#e46a2e",
        "soft-beige": "#f4efe6",
        "background-light": "#f6f7f8",
        "background-dark": "#121c20",
      },
      fontFamily: {
        display: ["Work Sans", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
};