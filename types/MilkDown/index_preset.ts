import {
  ThemeIcon,
  ThemeColor,
  ThemeFont,
  hex2rgb,
  Emotion,
  ThemeManager
} from "@milkdown/core";

import { getIcon } from "./icons";
import { colors, fonts } from "./theme";

export const createTheme = (_: Emotion, manager: ThemeManager) => {
  /* Get a color by key and opacity
  Possible keys are: primary, secondary, neutral, solid, shadow, line, surface and background */
  manager.set(ThemeColor, ([key]) => {
    const hex = colors[key];
    const rgb = hex2rgb(hex);
    if (!rgb) {
      return;
    }

    // for now opacity is 1
    return `rgba(${rgb?.join(", ")}, 1)`;
  });

  /* Get font families by key
  Possible keys are: typography and code */
  manager.set(ThemeFont, (key) => {
    if (!key) {
      return;
    }
    return fonts[key].join(", ");
  });

  /* Get icon by key
  The icon should be a { label: string; dom: HTMLElement } object */
  manager.set(ThemeIcon, (key) => {
    if (!key) {
      return;
    }
    return getIcon(key);
  });
};
