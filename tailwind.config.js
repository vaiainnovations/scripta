module.exports = {
  content: [],
  theme: {
    colors: {
      brand: "",
      primary: "#004CAD",
      "primary-light": "#3E86E1",
      background: "#FCF4E8",
      "primary-text": "#000000",
      "primary-text-light": "#696969",
      "background-alt": "#FFFCF9",
      danger: "#EE9898",
      success: "#75FF83",
      blue: "#1fb6ff",
      purple: "#7e5bef",
      pink: "#ff49db",
      orange: "#ff7849",
      green: "#13ce66",
      yellow: "#ffc82c",
      "gray-dark": "#273444",
      gray: "#8492a6",
      "gray-light": "#d3dce6"
    },
    fontFamily: {
      sans: ["Graphik", "sans-serif"],
      serif: ["Merriweather", "serif"]
    },
    extend: {
      spacing: {
        "8xl": "96rem",
        "9xl": "128rem"
      },
      borderRadius: {
        "4xl": "2rem"
      }
    }
  },
  plugins: [
    require("@tailwindcss/typography")
  ]
};
