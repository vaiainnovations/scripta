import { menu, menuPlugin } from "@milkdown/plugin-menu";
import {
  ToggleStrikeThrough,
  // TurnIntoTaskList,
  ToggleItalic,
  ToggleBold,
  ToggleLink,
  TurnIntoCodeFence,
  WrapInBulletList,
  WrapInOrderedList,
  ToggleInlineCode,
  InsertHr,
  InsertImage,
  TurnIntoHeading
} from "@milkdown/preset-gfm";

import { TurnIntoDiagram } from "@milkdown/plugin-diagram";
import { TurnIntoMathBlock, TurnIntoFootnoteDef } from "./CustomCommands";
import { InsertVideo } from "./Video";

import { hasMark, isTextAndNotHasMark, notBlockType, notWrapped, headingBlock, mobileEditorSize } from "./Utilities";

export const customMenu = menu.configure(menuPlugin, {
  domHandler: ({ menu, menuWrapper, milkdownDOM }) => {
    menuWrapper.insertBefore(menu, milkdownDOM.nextSibling);

    const children = menu.getElementsByClassName("button");
    for (const child of children) {
      child.className = `icon-hidden-mobile ${child.className}`;
    }

    // menu.className = `icon-hidden-mobile ${menu.className}`;
  },
  config: [
    [
      {
        type: "button",
        icon: "h1",
        key: TurnIntoHeading,
        options: 1,
        disabled: view => mobileEditorSize(view, undefined) || headingBlock(view.state)
      },
      {
        type: "button",
        icon: "h2",
        key: TurnIntoHeading,
        options: 2,
        disabled: view => mobileEditorSize(view, undefined) || headingBlock(view.state)
      },
      {
        type: "button",
        icon: "h3",
        key: TurnIntoHeading,
        options: 3,
        disabled: view => mobileEditorSize(view, undefined) || headingBlock(view.state)
      }
    ],
    [
      {
        type: "button",
        icon: "bold",
        key: ToggleBold,
        active: view => hasMark(view.state, view.state.schema.marks.strong),
        disabled: view =>
          mobileEditorSize(view, view.state.schema.marks.strong) || isTextAndNotHasMark(view.state, view.state.schema.marks.code_inline)
      },
      {
        type: "button",
        icon: "strikeThrough",
        key: ToggleStrikeThrough,
        active: view => hasMark(view.state, view.state.schema.marks.strike_through),
        disabled: view =>
          mobileEditorSize(view, view.state.schema.marks.strike_through) || isTextAndNotHasMark(view.state, view.state.schema.marks.code_inline)
      },
      {
        type: "button",
        icon: "italic",
        key: ToggleItalic,
        active: view => hasMark(view.state, view.state.schema.marks.em),
        disabled: view =>
          mobileEditorSize(view, view.state.schema.marks.em) || isTextAndNotHasMark(view.state, view.state.schema.marks.code_inline)
      },
      {
        type: "button",
        icon: "inlineCode",
        key: ToggleInlineCode,
        active: view => hasMark(view.state, view.state.schema.marks.code_inline),
        disabled: view => mobileEditorSize(view, view.state.schema.marks.code_inline) || !view.state.schema.marks.code_inline
      }
    ],
    [
      {
        type: "button",
        icon: "link",
        key: ToggleLink,
        active: view => hasMark(view.state, view.state.schema.marks.link),
        disabled: view => isTextAndNotHasMark(view.state, view.state.schema.marks.code_inline)
      },
      {
        type: "button",
        icon: "image",
        key: InsertImage
      },
      {
        type: "button",
        icon: "video",
        key: InsertVideo
      }
    ],
    [
      {
        type: "button",
        icon: "divider",
        key: InsertHr,
        disabled: view => notBlockType(view.state, view.state.schema.nodes.hr)
      }
    ],
    [
      // {
      //   type: "button",
      //   icon: "taskList",
      //   key: TurnIntoTaskList,
      //   disabled: view => notWrapped(view.state, view.state.schema.nodes.task_list_item)
      // },
      {
        type: "button",
        icon: "bulletList",
        key: WrapInBulletList,
        disabled: view => notWrapped(view.state, view.state.schema.nodes.bullet_list)
      },
      {
        type: "button",
        icon: "orderedList",
        key: WrapInOrderedList,
        disabled: view => notWrapped(view.state, view.state.schema.nodes.ordered_list)
      }
    ],
    [
      {
        type: "button",
        icon: "code",
        key: TurnIntoCodeFence,
        disabled: view =>
          notBlockType(view.state, view.state.schema.nodes.fence) || isTextAndNotHasMark(view.state, view.state.schema.marks.code_inline)
      },
      {
        type: "button",
        icon: "diagram",
        key: TurnIntoDiagram
      },
      {
        type: "button",
        icon: "math",
        key: TurnIntoMathBlock
      }
    ],
    [
      {
        type: "button",
        icon: "footnote",
        key: TurnIntoFootnoteDef
      }
    ]
  ]
});
