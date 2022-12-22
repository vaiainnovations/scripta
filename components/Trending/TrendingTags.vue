<template>
  <div class="w-full">
    <div class="flex pb-4">
      <img src="/icons/linear/quote-down-circle.svg">
      <h1 class="ml-2 text-3xl font-extrabold">
        Trending Topics
      </h1>
    </div>
    <div class="flex flex-wrap md:-m-2 -m-1">
      <div
        v-for="topic in tags"
        :key="topic"
        class="md:p-2 p-1"
      >
        <div class="">
          <TheTag :tag="topic" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useBackendStore } from "~~/core/store/BackendStore";
import { usePostStore } from "~~/core/store/PostStore";

// take the tags from the trending articles
let tags = [];
usePostStore().trendings.forEach((x) => {
  x.tags.forEach((y) => {
    if (!tags.includes(y)) {
      tags.push(y);
    }
  });
});
tags.sort(() => Math.random() - 0.5);

await useBackendStore()
  .fetch(`${useBackendStore().apiUrl}tags`, "POST", {})
  .then(async (res) => {
    const trendingTags = await res.json();
    const newTrendingTags = [];
    trendingTags.forEach((tag) => {
      newTrendingTags.push(tag.tag);
    });
    tags = newTrendingTags;
    tags.sort(() => Math.random() - 0.5);
  });
</script>
