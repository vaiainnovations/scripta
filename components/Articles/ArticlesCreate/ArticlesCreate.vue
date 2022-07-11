<template>
  <div class="bg-background w-full flex flex-col items-center justify-start px-4 gap-y-3.5 pt-3.5">
    <AuthButtonsBackRouting class="self-start" />
    <!-- Last edit -->
    <p class="text-primary-text-light text-sm self-end">
      Last edit: 1 June 10:23
    </p>
    <!-- Tags -->
    <div class="flex flex-col items-center w-full">
      <p class="text-primary-text-light font-medium text-xs self-start">
        Tags
      </p>
      <div class="grid grid-cols-10 w-full gap-y-2">
        <ArticlesCreateTag v-for="tag in tags" :key="tag.id" :content="tag.content" @remove-tag="() => removeTag(tag.id)" />
        <button v-if="tags.length < 6" class="col-span-1 rounded-full text-center bg-primary-text h-5 w-5 text-[#FFFFFF]" @click="addTag">
          +
        </button>
      </div>
    </div>
    <!-- Input form -->
    <!-- Title -->
    <div class="w-full flex flex-col items-center">
      <p class="text-primary-text-light font-medium text-xs self-start">
        Title
      </p>
      <input type="text" class="rounded-xl h-20 w-full border-primary-text-light border bg-background-alt">
    </div>
    <!-- Subtitle -->
    <div class="w-full flex flex-col items-center">
      <p class="text-primary-text-light font-medium text-xs self-start">
        Subtitle
      </p>
      <input type="text" class="rounded-xl h-32 w-full border border-primary-text-light bg-background-alt">
    </div>
    <!-- Content -->
    <div class="w-full flex flex-col items-center">
      <p class="text-primary-text-light font-medium text-xs self-start">
        Content
      </p>
    </div>
    <!-- Submit buttons -->
    <div class="grid grid-cols-2 w-full gap-y-4 gap-x-6">
      <button type="button" class="rounded-xl text-[#FFFFFF] bg-primary-text text-xl font-medium">
        Save Draft
      </button>
      <button type="button" class="rounded-xl text-[#FFFFFF] bg-danger text-xl font-medium">
        Delete
      </button>
      <button type="button" class="col-span-2 rounded-xl text-[#FFFFFF] bg-primary text-xl font-medium">
        Publish
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

const tags : Ref<Array<Tag>> = ref([]);

function addTag () {
  if (tags.value.length < 6) {
    const newTag: Tag = {
      id: tags.value.length,
      content: { value: "CIAO" }
    };

    tags.value = [...tags.value, newTag];
  }
}

function removeTag (index: number) {
  tags.value = [...tags.value.slice(0, index), ...tags.value.slice(index + 1)];
  tags.value = tags.value.map((v: Tag, i) => ({ ...v, id: i }));
}
</script>
