<template>
  <section
    v-if="editor"
    class="w-full h-fit relative"
  >
    <VueEditor :editor="editor.editor" />
  </section>
</template>

<script setup lang="ts">
import { VueEditor } from "@milkdown/vue";
interface Props {
  readOnly: boolean;
  content: string;
}
const props = defineProps<Props>();

let editor: any = ref(null);
if (process.client) {
  const { $useMarkDownEditor } = useNuxtApp();
  editor = $useMarkDownEditor(props.readOnly, props.content);
}
</script>

<style>
  .ProseMirror[data-placeholder]::before {
    color: theme('colors.primary-text-light');
    position: absolute;
    content: attr(data-placeholder);
    pointer-events: none;
    font-size: 1.25em;
    line-height: 1.5;
    padding-top: 0.6rem;
    padding-left: 0.1rem;
  }
</style>
