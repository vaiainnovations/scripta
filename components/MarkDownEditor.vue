<template>
  <VueEditor class="w-full h-fit" :editor="editor" />
</template>

<script setup lang="ts">
import { defaultValueCtx, Editor, rootCtx } from "@milkdown/core";
import { VueEditor, useEditor } from "@milkdown/vue";
// import { commonmark } from "@milkdown/preset-commonmark";
import { gfm, link } from "@milkdown/preset-gfm";
import { listenerCtx, listener } from "@milkdown/plugin-listener";
import { tooltip, tooltipPlugin } from "@milkdown/plugin-tooltip";
import { customTheme } from "~~/types/MilkDown";
import { customMenu } from "~~/types/MilkDown/menu";

const editorValue = ref("");

const { editor } = useEditor(root =>
  Editor
    .make()
    .config((ctx) => {
      ctx.set(rootCtx, root);
      ctx.set(defaultValueCtx, editorValue.value);
      ctx.get(listenerCtx)
        .markdownUpdated((_, markdown) => {
          editorValue.value = markdown;
        });
    })
    .use(customTheme)
    .use(gfm.configure(link, {
      input: {
        placeholder: "link",
        buttonText: "Apply"
      }
    }))
    .use(tooltip.configure(tooltipPlugin, {
      bottom: true
    }))
    .use(customMenu)
    .use(listener)
);
</script>

<style>
</style>
