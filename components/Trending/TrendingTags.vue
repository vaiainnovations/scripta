<template>
  <div class="w-full">
    <div class="flex pb-4">
      <img src="/icons/linear/quote-down-circle.svg">
      <h1 class="ml-2 text-3xl font-extrabold">
        Topics
      </h1>
    </div>
    <div class="flex flex-wrap md:-m-2 -m-1">
      <div
        v-for="topic in tags"
        :key="topic"
        class="md:p-2 p-1"
      >
        <div class="bg-background-alt hover:bg-white rounded-md px-4 py-0.5 border border-gray cursor-pointer">
          <NuxtLink
            :to="`/tag/${topic}`"
            class="text-lg font-medium"
          >
            {{ topic }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePostStore } from "~~/core/store/PostStore";

// take the tags from the trending articles
const tags = [];
usePostStore().trendings.forEach((x) => {
  x.tags.forEach((y) => {
    if (!tags.includes(y)) {
      tags.push(y);
    }
  });
});
</script>
