<template>
  <div class="flex flex-col items-center w-full gap-y-2">
    <p class="text-primary-text-light font-medium text-xs self-start">
      Tags
    </p>
    <div class="grid grid-cols-10 w-full gap-y-2 lg:grid-cols-12">
      <ArticlesCreateTag v-for="tag in tags" :key="tag.id" v-model="tag.content.value" :content="tag.content" @remove-tag="() => removeTag(tag.id)" />
      <button v-if="tags.length < maxTags" class="flex flex-col justify-center items-center col-span-1 rounded-full bg-primary-text h-5 w-5 text-[#FFFFFF]" @click="addTag">
        +
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref } from "vue";
import { TagType } from "~~/types/TagType";

interface Tag {
  id: number;
  content: TagType;
}

const tags: Ref<Array<Tag>> = ref([]);
const maxTags = 9;

function addTag () {
  if (tags.value.length < maxTags) {
    const newTag: Tag = {
      id: tags.value.length,
      content: { value: "" }
    };

    tags.value = [...tags.value, newTag];
  }
}

function removeTag (index: number) {
  tags.value = [...tags.value.slice(0, index), ...tags.value.slice(index + 1)];
  tags.value = tags.value.map((v: Tag, i) => ({ ...v, id: i }));
}
</script>
