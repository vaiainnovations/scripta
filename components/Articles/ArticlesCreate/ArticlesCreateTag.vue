<template>
  <div class="block relative h-fit w-20 col-span-3">
    <ArticlesViewTag class="justify-start py-0" :content="props.content">
      <input
        v-model="inputTag"
        type="text"
        class="bg-primary-light text-left text-xs text-background-alt w-full h-full rounded-xl pl-0.5"
        maxlength="5"
        :readonly="!enableEdit"
        @focus.stop="() => switchInput(true)"
        @blur.stop="() => switchInput(false)"
      >
    </ArticlesViewTag>
    <button class="rounded-full text-center bg-primary-text h-5 w-5 text-[#FFFFFF] absolute right-0 inset-y-0" @click="$emit('removeTag')">
      -
    </button>
  </div>
</template>

<script setup lang="ts">
import { TagType } from "~~/types/TagType";

interface Props {
  content: TagType
}

const props = defineProps<Props>();

const inputTag = ref(props.content.value || "");

const enableEdit = ref(false);
// Enable/disable input field to edit tag
function switchInput (enable: boolean) {
  enableEdit.value = enable;
}
</script>
