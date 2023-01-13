<template>
  <div class="block relative h-5 w-11/12 col-span-12 sm:col-span-4 md:col-span-3 lg:col-span-2">
    <ArticlesViewTag class="justify-start py-0" :content="content">
      <input
        :value="modelValue"
        type="text"
        class="bg-gray-light text-left text-primary-color w-full rounded-xl px-2"
        maxlength="15"
        :readonly="!enableEdit"
        @input="handleInput"
        @focus.stop="() => switchInput(true)"
        @blur.stop="() => switchInput(false)"
      >
    </ArticlesViewTag>
    <img
      src="/icons/bold/minus-circle.svg"
      class="w-6 h-6 object-contain cursor-pointer absolute right-0 top-0"
      @click="$emit('removeTag')"
    >
  </div>
</template>

<script setup lang="ts">
import { TagType } from "~~/types/TagType";

interface Props {
  modelValue: string,
  content: TagType
}

defineProps<Props>();
const emit = defineEmits(["update:modelValue", "removeTag"]);

const enableEdit = ref(false);
// Enable/disable input field to edit tag
function switchInput (enable: boolean) {
  enableEdit.value = enable;
}

function handleInput (event: Event) {
  emit("update:modelValue", (event.target as HTMLInputElement).value);
}
</script>
