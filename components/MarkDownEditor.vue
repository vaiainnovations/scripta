<template>
  <VueEditor class="w-full" :editor="mdEditor.editor" />
</template>

<script setup lang="ts">
import { Editor, rootCtx } from "@milkdown/core";
import { nord } from "@milkdown/theme-nord";
import { VueEditor, useEditor } from "@milkdown/vue";
import { commonmark, ToggleItalic, ToggleBold } from "@milkdown/preset-commonmark";
import { ToggleStrikeThrough, TurnIntoTaskList } from "@milkdown/preset-gfm";
import { menu, menuPlugin } from "@milkdown/plugin-menu";
import { EditorState } from "@milkdown/prose/state";
import { MarkType } from "@milkdown/prose/model";

// preset-commonmark: ToggleLink, ToggleItalic, ToggleBold, ToggleInlineCode
// preset-gfm: TurnIntoTaskList
// missing: underline, paperclip

const hasMark = (state: EditorState, type: MarkType | undefined): boolean => {
  if (!type) { return false; }
  const { from, $from, to, empty } = state.selection;
  if (empty) {
    return !!type.isInSet(state.storedMarks || $from.marks());
  }
  return state.doc.rangeHasMark(from, to, type);
};

const mdEditor = await useEditor(root =>
  Editor.make()
    .config((ctx) => {
      ctx.set(rootCtx, root);
    })
    .use(nord)
    .use(commonmark)
    .use(menu.configure(menuPlugin, {
      config: [
        [
          {
            type: "button",
            icon: "bold",
            key: ToggleBold,
            active: view => hasMark(view.state, view.state.schema.marks.strong)
          },
          {
            type: "button",
            icon: "italic",
            key: ToggleItalic,
            active: view => hasMark(view.state, view.state.schema.marks.em)
          },
          {
            type: "button",
            icon: "strikeThrough",
            key: ToggleStrikeThrough,
            active: view => hasMark(view.state, view.state.schema.marks.strike_through)
          }
        ],
        [
          {
            type: "button",
            icon: "taskList",
            key: TurnIntoTaskList
            // disabled: (view) => {
            //   const { state } = view;
            //   return !wrapIn(state.schema.nodes.task_list_item)(state);
            // }
          }
        ]
      ]
    }))
);
</script>
