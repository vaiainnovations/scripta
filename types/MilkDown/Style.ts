/* Copyright 2021, Milkdown by Mirone. */

import { Emotion, ThemeBorder, ThemeFont, ThemeManager, ThemeScrollbar, ThemeShadow, ThemeSize } from "@milkdown/core";
import { getPalette } from "@milkdown/design-system";
import { injectProsemirrorView } from "@milkdown/theme-pack-helper";

export const getStyle = (manager: ThemeManager, emotion: Emotion) => {
  const { injectGlobal, css } = emotion;

  // colors
  const palette = getPalette(manager);
  const primaryColor = palette("primary");
  const secondaryColor = palette("secondary");
  const secondaryColorAlt = palette("secondary", 0.5);
  const neutralColor = palette("neutral");
  const neutralAltColor = palette("neutral", 0.87);
  //   const highlight = palette("secondary", 0.38);
  const solidColor = palette("solid");
  const solidColorAlt = palette("solid", 0.4);
  const lineColor = palette("line");
  const surfaceColor = palette("surface");
  const backgroundColor = palette("background");

  // sizes
  const radius = manager.get(ThemeSize, "radius");
  const lineWidth = manager.get(ThemeSize, "lineWidth");

  // borders
  const borderAll = manager.get(ThemeBorder, undefined);
  // const borderTop = manager.get(ThemeBorder, "top");

  // fonts
  const codeFont = manager.get(ThemeFont, "code");
  const typographyFont = manager.get(ThemeFont, "typography");

  // scrollbar
  const scrollBarX = manager.get(ThemeScrollbar, ["x"]);
  const scrollBarY = manager.get(ThemeScrollbar, ["y", "thin"]);

  // shadow
  const shadow = manager.get(ThemeShadow, undefined);

  // text properties
  const textFontSize = "1.125rem";
  const textLineHeight = "1.75rem";

  // Code style
  const codeStyle = css`
    .code-fence {
      ${borderAll};

      pre {
        font-family: ${codeFont};
        margin: 0 1.2em !important;
        white-space: pre;
        overflow: auto;
        padding: 0.5rem;
        ${scrollBarX}

        background-color: ${backgroundColor};
        color: ${neutralColor};
        font-size: 1rem;
        border-radius: ${radius};

        code {
          line-height: 1.5;
          font-family: ${codeFont};
        }
      }
    }
  `;

  const inlineStyle = css`
    .code-inline {
      background-color: ${solidColor};
      color: ${backgroundColor};
      border-radius: ${radius};
      font-weight: 500;
      font-family: ${codeFont};
      padding: 0 0.2em;
    }

    .strong {
      font-weight: 600;
    }

    .link,
    a {
      color: ${secondaryColor};
      cursor: pointer;
      transition: all 0.4s ease-in-out;
      font-weight: 500;
      &:hover {
        background-color: ${lineColor};
        box-shadow: 0 0.2em ${lineColor}, 0 -0.2em ${lineColor};
      }
    }

    .strike-through {
      text-decoration-color: ${secondaryColor};
    }
  `;

  // Horizontal line style
  const hrStyle = css`
    hr {
      height: ${lineWidth};
      background-color: ${lineColor};
      border-width: 0;
    }
  `;

  // Blockquote style
  const blockquoteStyle = css`
    blockquote {
      padding-left: 1.875em;
      line-height: 1.75em;
      border-left: 4px solid ${primaryColor};
      margin-left: 0;
      margin-right: 0;
      * {
        font-size: 1rem;
        line-height: 1.5rem;
      }
    }
  `;

  // Heading style
  const headingStyle = css`
    h1 {
      font-size: 3rem;
      line-height: 1;
    }
    h2 {
      font-size: 2.25rem;
      line-height: 2.5rem;
    }
    h3 {
      font-size: 1.875rem;
      line-height: 2.25rem;
    }
    /* h4 {
      font-size: 1.5rem;
      line-height: 2rem;
    }
    h5 {
      font-size: 1.25rem;
      line-height: 1.75rem;
    }
    h6 {
      font-size: 1.125rem;
      line-height: 1.75rem;
    }*/
    .heading {
      margin: 40px 0;
      font-weight: 400;
    }
  `;

  // Paragraph style
  const paragraphStyle = css`
    p {
      font-size: ${textFontSize};
      line-height: ${textLineHeight};
      letter-spacing: 0.5px;
    }
  `;

  // Strike through style
  const strikeThroughStyle = css`
    .strike-through {
      text-decoration-line: underline;
      text-decoration-thickness: 2px;
    }
  `;

  const listStyle = css`
    ul,
    ol {
      padding: 0;
    }

    .list-item,
    .task-list-item {
      margin: 8px 0;
    }

    .list-item_label,
    .list-item .paragraph {
      margin: 0;
    }

    .list-item[data-list-type="ordered"] {
      align-items: baseline;
    }

    .list-item {
      display: flex;
      align-items: center;
      &_body {
        flex: 1;
      }
    }

    .list-item_label {
      display: flex;
      flex-direction: column;
      justify-content: center;
      justify-items: center;
      width: 24px;
      height: 24px;

      font-size: ${textFontSize}
      line-height: ${textLineHeight};
      color: ${neutralAltColor};
    }

    .list-item[data-list-type="bullet"] {
      & > .list-item_label {
        font-size: ${textFontSize};
        line-height: ${textLineHeight};
      }
    }

    li {
      &::marker {
        display: none;
      }
    }

    .task-list-item {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      &_checkbox {
        margin: 0.5em 0.5em 0.5em 0;
        height: 1em;
      }
      & .paragraph {
        margin: 0;
      }
    }
  `;

  // Image style
  const mediaStyle = css`
    .image-container,
    .video-container {
      display: flex;
      margin: auto auto;
      object-fit: contain;
      width: fit-content;
      position: relative;
      height: auto;
      text-align: center;

      &.ProseMirror-selectednode {
        border: 0;
        border-radius: 4px;
      }
    }
  `;

  const emojiStyle = css`
    .emoji-wrapper {
      .emoji {
        display: inline-block;
      }
    }
  `;

  const diagramStyle = css`
    .edgePath {
      .path {
        stroke-width: 1px !important;
      }
    }
  `;

  // footnote
  const footnoteStyle = css`
  .footnote-definition {
    ${borderAll}
    border-radius: ${radius}
    background-color: ${backgroundColor};
    padding: 16px;
    display: flex;
    flex-direction: row;
    & > .footnote-definition_content {
        flex: 1;
        width: calc(100% - 16px);
        & > dd {
            margin-inline-start: 16px;
        }
        & > dt {
            color: ${secondaryColor};
            font-weight: 500;
        }
    }
    & > .footnote-definition_anchor {
        width: 16px;
    }
}
  `;

  // Editor style
  // TODO add table
  const editorStyle = css`
    .editor {
      height: 100%;
      overflow-y: auto;
      padding: 1.75rem;
      outline: none;
      position: relative;

      & > * {
        margin: 0.75em 0;
      }

      ${paragraphStyle}
      ${strikeThroughStyle}
      ${emojiStyle}

      ${diagramStyle}

      ${hrStyle}

      ${listStyle}

      ${codeStyle}
      ${inlineStyle}

      ${mediaStyle}

      ${headingStyle}

      ${footnoteStyle}

      ${blockquoteStyle}
    }
  `;

  // Tooltip style
  const tooltipStyle = css`
    .tooltip.hide {
      display: none;
    }
    .tooltip {
      display: flex;
      flex-direction: row;
      justify-content: center;
      justify-items: center;
      column-gap: 0.75rem;
      align-items: flex-end;

      padding: 0.25rem;

      .milkdown-icons {
        font-size: 1.125rem;

        &.heading-h1 {
          font-size: 1.125em;
        }

        &.heading-h2 {
          font-size: 1rem;
        }

        &.heading-h3 {
          font-size: 0.875rem;
        }

        &.heading-text {
          font-size: 0.75rem;
        }
      }
    }
  `;

  const tooltipInputStyle = css`
    .tooltip-input {
      input::placeholder {
        color: ${solidColorAlt};
      }
      button {
        color: ${solidColor};
      }
    }
  `;

  // Prosemirror selection style
  const selection = css`
    .ProseMirror-selectednode {
      outline: ${lineWidth} solid ${lineColor};
    }

    li.ProseMirror-selectednode {
      outline: none;
    }

    li.ProseMirror-selectednode::after {
      ${borderAll};
    }
  `;

  // Editor container style
  const containerStyle = css`
    .milkdown {
      width: 100%;
      min-height: 632px;

      margin-left: auto;
      margin-right: auto;
      box-sizing: border-box;

      position: relative;

      color: ${neutralAltColor};
      background-color: ${surfaceColor};
      font-family: ${typographyFont};

      .resize-cursor {
        cursor: ew-resize;
        cursor: col-resize;
      }

      ${shadow}
      ${scrollBarY}

      ${selection}

      ${tooltipStyle}
      ${tooltipInputStyle}

      ${editorStyle}
    }
  `;

  // Menu style
  const menuStyle = css`
    .milkdown-menu {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      justify-items: center;
      width: 100%;
      border: 0;
      box-sizing: border-box;

      .milkdown-icons {
        font-size: 1.5rem;

        &.heading-h1 {
          font-size: 1.5rem;
        }

        &.heading-h2 {
          font-size: 1.25rem;
        }

        &.heading-h3 {
          font-size: 1.125rem;
        }

        &.heading-text {
          font-size: 1rem;
        }
      }

      .button {
        align-items: flex-end;

        &.active,
        &:hover {
          background-color: ${secondaryColorAlt};
          color: ${solidColor};
        }
      }
    }
  `;

  injectProsemirrorView(emotion);

  /* .milkdown is the container of the whole editor */
  /* .editor is the editable part, wrapped in the container  */
  injectGlobal`
    .milkdown-menu-wrapper {
      display: flex;
      flex-direction: column;
      justify-items: center;
      padding: 0.5rem;
      row-gap: 0.5rem;

      ${borderAll}
      background-color: ${surfaceColor};

      ${menuStyle}
      ${containerStyle}
    }
  `;
};
