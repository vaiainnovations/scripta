import { menu, menuPlugin } from "@milkdown/plugin-menu";
import {
  ToggleStrikeThrough,
  TurnIntoTaskList,
  ToggleItalic,
  ToggleBold,
  ToggleLink,
  ToggleInlineCode,
  WrapInBulletList,
  WrapInOrderedList
} from "@milkdown/preset-gfm";
import { EditorState } from "@milkdown/prose/state";
import { MarkType, NodeType } from "@milkdown/prose/model";
import { wrapIn } from "@milkdown/prose/commands";

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

const notWrapped = (state: EditorState, node: NodeType | undefined): boolean => {
  if (!node) {
    return true;
  }
  return !wrapIn(node)(state);
};

export const customMenu = menu.configure(menuPlugin, {
  config: [
    [
      {
        type: "button",
        icon: "link",
        key: ToggleLink,
        active: view => hasMark(view.state, view.state.schema.marks.link)
      }
    ],
    [
      {
        type: "button",
        icon: "bold",
        key: ToggleBold,
        active: view => hasMark(view.state, view.state.schema.marks.strong),
        disabled: view => !view.state.schema.marks.strong
      },
      {
        type: "button",
        icon: "strikeThrough",
        key: ToggleStrikeThrough,
        active: view => hasMark(view.state, view.state.schema.marks.strike_through),
        disabled: view => !view.state.schema.marks.strike_through
      },
      {
        type: "button",
        icon: "italic",
        key: ToggleItalic,
        active: view => hasMark(view.state, view.state.schema.marks.em),
        disabled: view => !view.state.schema.marks.em
      }
    ],
    [
      {
        type: "button",
        icon: "taskList",
        key: TurnIntoTaskList,
        disabled: view => notWrapped(view.state, view.state.schema.nodes.task_list_item)
      },
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
        key: ToggleInlineCode,
        active: view => hasMark(view.state, view.state.schema.marks.code_inline),
        disabled: view => !view.state.schema.marks.code_inline
      }
    ]
  ]
});
