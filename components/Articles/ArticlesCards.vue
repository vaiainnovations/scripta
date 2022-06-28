<template>
  <div class="md:gap-y-14 md:gap-x-20 md:grid md:grid-cols-2 p-2">
    <div class="md:col-span-2">
      <ArticlesPreview :content="trendingPosts[0]" />
    </div>
    <ArticlesSmallPreview
      v-for="(post, i) in trendingPosts"
      :key="i"
      :content="post"
    />
  </div>
</template>

<script setup lang="ts">
import { PostPreview } from "~~/types/PostPreview";

const trendingPostsRaw = ref(await $fetch("/api/posts/trending"));
let trendingPosts = [];
if (trendingPostsRaw) {
  trendingPosts = trendingPostsRaw.value as PostPreview[];
}

</script>
