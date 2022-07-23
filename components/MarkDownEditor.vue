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
import { upload } from "@milkdown/plugin-upload";
import { math } from "@milkdown/plugin-math";
import { diagram } from "@milkdown/plugin-diagram";
import { emoji } from "@milkdown/plugin-emoji";
import { block } from "@milkdown/plugin-block";

import { customTheme } from "~~/types/MilkDown";
import { customMenu } from "~~/types/MilkDown/menu";
import { useDraftStore } from "~~/core/store/DraftStore";

const { editor } = useEditor(root =>
  Editor
    .make()
    .config((ctx) => {
      ctx.set(rootCtx, root);
      ctx.set(defaultValueCtx, useDraftStore().content);
      ctx.get(listenerCtx)
        .markdownUpdated((_, markdown) => {
          useDraftStore().content = markdown;
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
    .use(upload)
    .use(math)
    .use(diagram)
    .use(emoji)
    .use(block)
    .use(customMenu)
    .use(listener)
);
</script>

<style>
</style>
