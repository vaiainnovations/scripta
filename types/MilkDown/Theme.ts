import { Color } from "@milkdown/design-system";
// import resolveConfig from "tailwindcss/resolveConfig";
// import tailwindConfig from "@/tailwind.config.js";

// const fullConfig = resolveConfig(tailwindConfig);

// const twColors = {
//   "background-alt": "#FF0000",
//   "primary-light": "#00FF00",
//   "primary-text-light": typeof (fullConfig.theme?.colors) === "object" ? fullConfig.theme.colors(colors: prima) : "#0000FF"
// };

export const colors: Record<Color, string> = {
  primary: "#000000",
  secondary: "#3E86E1",
  neutral: "#000000",
  solid: "#696969",
  shadow: "#FFFCF9",
  line: "#696969",
  surface: "#FFFCF9",
  background: "#FFFCF9"
};

export const sizes = {
  radius: "4px",
  lineWidth: "1px"
};

export const fonts = {
  typography: [
    "Poppins",
    "sans-serif"
  ],
  code: ["monospace"]
};
