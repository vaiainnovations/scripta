<template>
  <VueEditor class="w-full h-fit relative" :editor="editor" />
</template>

<script setup lang="ts">
import { defaultValueCtx, editorViewOptionsCtx, Editor, rootCtx } from "@milkdown/core";
import { VueEditor, useEditor } from "@milkdown/vue";
import { gfm, link, image } from "@milkdown/preset-gfm";
import { listenerCtx, listener } from "@milkdown/plugin-listener";
import { tooltip, tooltipPlugin } from "@milkdown/plugin-tooltip";
import { upload } from "@milkdown/plugin-upload";
import { math } from "@milkdown/plugin-math";
import { diagram } from "@milkdown/plugin-diagram";
import { emoji } from "@milkdown/plugin-emoji";
// import { block } from "@milkdown/plugin-block";

import { customTheme } from "~~/types/MilkDown";

import { customMenu } from "~~/types/MilkDown/Menu";
import { useDraftStore } from "~~/core/store/DraftStore";
// import { mathPlugin } from "~~/types/MilkDown/MathCommand";

interface Props {
  readOnly: boolean
  content: string
}
const props = defineProps<Props>();

const editorValue = ref(props.content || useDraftStore().content);

const { editor } = useEditor(root =>
  Editor.make()
    .config((ctx) => {
      ctx.set(rootCtx, root);
      ctx.set(defaultValueCtx, editorValue.value);
      ctx.get(listenerCtx).markdownUpdated((_, markdown) => {
        useDraftStore().content = markdown;
      });
      ctx.set(editorViewOptionsCtx, { editable: () => !props.readOnly });
    })
    .use(
      gfm
        .configure(link, {
          input: {
            placeholder: "link",
            buttonText: "Apply"
          }
        })
        .configure(image, {
          input: {
            placeholder: "link",
            buttonText: "Apply"
          }
        })
    )
    .use(
      tooltip.configure(tooltipPlugin, {
        bottom: false
      })
    )
    .use(upload)
    .use(math)
    .use(diagram)
    .use(emoji)
    // .use(block)
    .use(customMenu)
    .use(customTheme)
    .use(listener)
);
</script>
