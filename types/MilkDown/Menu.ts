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
  InsertImage
} from "@milkdown/preset-gfm";

import { EditorState } from "@milkdown/prose/state";
import { NodeType, MarkType } from "@milkdown/prose/model";
import { wrapIn, setBlockType } from "@milkdown/prose/commands";
import { findParentNode } from "@milkdown/prose";
import { TurnIntoDiagram } from "@milkdown/plugin-diagram";
import { TurnIntoMathBlock } from "./MathCommand";

const hasMark = (state: EditorState, type: MarkType | undefined): boolean => {
  if (!type) {
    return false;
  }
  const { from, $from, to, empty } = state.selection;
  if (empty) {
    return !!type.isInSet(state.storedMarks || $from.marks());
  }
  return state.doc.rangeHasMark(from, to, type);
};

const isInCodeFence = (editorState: EditorState): boolean =>
  Boolean(findParentNode(node => !!node.type.spec.code)(editorState.selection));

const isTextAndNotHasMark = (editorState: EditorState, mark?: MarkType): boolean =>
  isInCodeFence(editorState) || hasMark(editorState, mark);

const notBlockType = (state: EditorState, node: NodeType | undefined): boolean => {
  if (!node) {
    return true;
  }
  return !setBlockType(node)(state);
};

const notWrapped = (state: EditorState, node: NodeType | undefined): boolean => {
  if (!node) {
    return true;
  }
  return !wrapIn(node)(state);
};

export const customMenu = menu
  .configure(menuPlugin, {
    config: [
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
        }
      ],
      [
        {
          type: "button",
          icon: "bold",
          key: ToggleBold,
          active: view => hasMark(view.state, view.state.schema.marks.strong),
          disabled: view => isTextAndNotHasMark(view.state, view.state.schema.marks.code_inline)
        },
        {
          type: "button",
          icon: "strikeThrough",
          key: ToggleStrikeThrough,
          active: view => hasMark(view.state, view.state.schema.marks.strike_through),
          disabled: view => isTextAndNotHasMark(view.state, view.state.schema.marks.code_inline)
        },
        {
          type: "button",
          icon: "italic",
          key: ToggleItalic,
          active: view => hasMark(view.state, view.state.schema.marks.em),
          disabled: view => isTextAndNotHasMark(view.state, view.state.schema.marks.code_inline)
        },
        {
          type: "button",
          icon: "code",
          key: ToggleInlineCode,
          active: view => hasMark(view.state, view.state.schema.marks.code_inline),
          disabled: view => !view.state.schema.marks.code_inline
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
          icon: "inlineCode",
          key: TurnIntoCodeFence,
          disabled: view => notBlockType(view.state, view.state.schema.nodes.fence) || isTextAndNotHasMark(view.state, view.state.schema.marks.code_inline)
        },
        {
          type: "button",
          icon: "table",
          key: TurnIntoDiagram
        },
        {
          type: "button",
          icon: "redo",
          key: TurnIntoMathBlock
        }
      ]
    ]
  });
