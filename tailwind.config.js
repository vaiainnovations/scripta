/** @type {import('tailwindcss').Config} */
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
      orange: "#f29100",
      "orange-light": "#ffa756",
      green: "#13ce66",
      "green-light": "#5BFF6C",
      yellow: "#ffc82c",
      "gray-dark": "#273444",
      gray: "#8492a6",
      "gray-light": "#F1EFEC",
      white: "#ffffff"
    },
    fontFamily: {
      sans: ["Poppins", "sans-serif"],
      serif: ["Garet Book", "Garet Heavy", "serif"],
      milkdown: ["MilkdownIcons", "serif"]
    },
    extend: {
      screens: {
        "3xl": "1600px"
      },
      spacing: {
        "8xl": "96rem",
        "9xl": "128rem"
      },
      boxShadow: {
        "4xl": "2px 3px 1px 5px black",
        "5xl": "4px 5px 1px 8px black"
      },
      borderRadius: {
        "4xl": "2rem"
      }
    }
  },
  plugins: [
    require("@tailwindcss/typography")
  ]
}