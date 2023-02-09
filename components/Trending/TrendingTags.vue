<template>
  <div class="w-full">
    <div class="flex pb-4">
      <img src="/icons/linear/quote-down-circle.svg">
      <h1 class="ml-2 text-3xl font-extrabold">
        Trending Topics
      </h1>
    </div>
    <div v-if="!isLoading" class="flex flex-wrap md:-m-2 -m-1">
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
    <div v-else class="grid grid-cols-2">
      <div
        v-for="i in 15"
        :key="i"
        class="md:p-2 p-1 col-span-1"
      >
        <div class="bg-gray-light/70 mx-auto w-full animate-pulse h-5 md:h-8 rounded-lg" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useBackendStore } from "~~/core/store/BackendStore";

// take the tags from the trending articles
const tags = useState("trendingTags", () => []);
const isLoading = ref(true);

useBackendStore()
  .fetch(`${useBackendStore().apiUrl}tags`, "POST", {})
  .then(async (res) => {
    const trendingTags = await res.json();
    const newTrendingTags = [];
    trendingTags.forEach((tag) => {
      newTrendingTags.push(tag.tag);
    });
    // set tags to the first 10 trending tags
    tags.value = newTrendingTags.slice(0, 20);
    isLoading.value = false;
  });
</script>
