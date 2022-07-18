import {
  themeFactory,
  ThemeIcon,
  ThemeColor,
  ThemeSize,
  ThemeFont,
  ThemeScrollbar,
  ThemeShadow,
  ThemeBorder,
  ThemeGlobal,
  hex2rgb,
  Emotion,
  ThemeManager
} from "@milkdown/core";
import { useAllPresetRenderer } from "@milkdown/theme-pack-helper";

import { getIcon } from "./icons";
import { colors, sizes, fonts } from "./theme";
import { getStyle } from "./style";
import { getScrollbar } from "./scrollbar";

export const createTheme = (emotion: Emotion, manager: ThemeManager) => {
  const { css } = emotion;

  /* Get a color by key and opacity
  Possible keys are: primary, secondary, neutral, solid, shadow, line, surface and background */
  manager.set(ThemeColor, ([key]) => {
    const hex = colors[key];
    // convert the hex color to rgb
    const rgb = hex2rgb(hex);
    if (!rgb) {
      return;
    }

    // for now opacity is set to 1
    return `rgba(${rgb?.join(", ")}, 1)`;
  });

  /* Get a size by key
  Possible keys are: radius and lineWidth */
  manager.set(ThemeSize, (key) => {
    if (!key) {
      return;
    }
    return sizes[key];
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

  // TODO inspect better the shadow theme
  manager.set(ThemeShadow, () => {
    const lineWidth = manager.get(ThemeSize, "lineWidth");
    const getShadow = (opacity: number) => manager.get(ThemeColor, ["shadow", opacity]);
    return css`
      box-shadow: 0 ${lineWidth} ${lineWidth} ${getShadow(0.14)}, 0 2px ${lineWidth} ${getShadow(0.12)}, 0 ${lineWidth} 3px ${getShadow(0.2)};
    `;
  });

  // TODO inspect better the border theme
  manager.set(ThemeBorder, (direction) => {
    const lineWidth = manager.get(ThemeSize, "lineWidth");
    const line = manager.get(ThemeColor, ["line"]);
    if (!direction) {
      return css`
        border: ${lineWidth} solid ${line};
        border-radius: 0.5rem;
      `;
    }
    return css`
      ${`border-${direction}`}: ${lineWidth} solid ${line};
      border-radius: 0.5rem;
    `;
  });

  // TODO inspect better the scrollbar theme
  /* Get scrollbar by direction and type */
  manager.set(ThemeScrollbar, ([direction = "y", type = "normal"] = ["y", "normal"] as never) => {
    const main = manager.get(ThemeColor, ["secondary", 0.38]);
    const bg = manager.get(ThemeColor, ["secondary", 0.12]);
    const hover = manager.get(ThemeColor, ["secondary"]);
    return css(getScrollbar(main, bg, hover, direction, type));
  });

  manager.set(ThemeGlobal, () => {
    getStyle(manager, emotion);
  });

  useAllPresetRenderer(manager, emotion);
};

export const customTheme = themeFactory((emotion, manager) => createTheme(emotion, manager));
