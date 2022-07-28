<template>
  <section
    v-if="editor"
    class="w-full h-fit relative"
  >
    <VueEditor :editor="editor" />
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
  editor = $useMarkDownEditor(props.readOnly, props.content).editor;
}
</script>
