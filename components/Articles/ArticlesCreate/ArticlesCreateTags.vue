<template>
  <div class="flex flex-col items-center w-full gap-y-2">
    <p class="text-primary-text-light font-medium text-xs self-start">
      Tags
    </p>
    <div class="grid grid-cols-12 md:grid-cols-10 w-full gap-y-2 lg:grid-cols-12">
      <ArticlesCreateTag v-for="tag in useDraftStore().tags" :key="tag.id" v-model="tag.content.value" :content="tag.content" @remove-tag="() => removeTag(tag.id)" />
      <img
        v-if="useDraftStore().tags.length < maxTags"
        src="/icons/bold/add-circle.svg"
        class="w-6 h-6 object-contain cursor-pointer"
        @click="addTag"
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { EditorTag, useDraftStore } from "~~/core/store/DraftStore";

const maxTags = 9;

function addTag () {
  const draftStore = useDraftStore();
  if (draftStore.tags.length < maxTags) {
    const newTag: EditorTag = {
      id: draftStore.tags.length,
      content: { value: "" }
    };

    draftStore.tags = [...draftStore.tags, newTag];
  }
}

function removeTag (index: number) {
  const draftStore = useDraftStore();
  draftStore.tags = [...draftStore.tags.slice(0, index), ...draftStore.tags.slice(index + 1)];
  draftStore.tags = draftStore.tags.map((v: EditorTag, i) => ({ ...v, id: i }));
}
</script>
