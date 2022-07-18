import { menu, menuPlugin } from "@milkdown/plugin-menu";
import { ToggleStrikeThrough, TurnIntoTaskList, ToggleItalic, ToggleBold, ToggleLink, ToggleInlineCode } from "@milkdown/preset-gfm";
// import { EditorState } from "@milkdown/prose/state";
// import { MarkType } from "@milkdown/prose/model";

// const hasMark = (state: EditorState, type: MarkType | undefined): boolean => {
//   if (!type) {
//     return false;
//   }
//   const { from, $from, to, empty } = state.selection;
//   if (empty) {
//     return !!type.isInSet(state.storedMarks || $from.marks());
//   }
//   return state.doc.rangeHasMark(from, to, type);
// };

export const customMenu = menu.configure(menuPlugin, {
  config: [
    [
      {
        type: "button",
        icon: "link",
        key: ToggleLink
      },
      {
        type: "button",
        icon: "bold",
        key: ToggleBold
        // active: view => hasMark(view.state, view.state.schema.marks.strong)
      },
      {
        type: "button",
        icon: "strikeThrough",
        key: ToggleStrikeThrough
        // active: view => hasMark(view.state, view.state.schema.marks.strike_through)
      },
      {
        type: "button",
        icon: "italic",
        key: ToggleItalic
        // active: view => hasMark(view.state, view.state.schema.marks.em)
      },
      {
        type: "button",
        icon: "taskList",
        key: TurnIntoTaskList
        // disabled: (view) => {
        //   const { state } = view;
        //   return !wrapIn(state.schema.nodes.task_list_item)(state);
        // }
      },
      {
        type: "button",
        icon: "code",
        key: ToggleInlineCode
      }
    ]
  ]
});
