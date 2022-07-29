<template>
  <div class="p-2 md:grid md:grid-cols-2 md:gap-y-14 md:gap-x-10 w-full">
    <div v-if="trendingPosts.length > 0" class="md:col-span-2">
      <ArticlesPreview :content="{title: trendingPosts[0].text, description: trendingPosts[0].subtitle, image: trendingPosts[0].image}" />
    </div>
    <ArticlesSmallPreview
      v-for="(post, i) in trendingPosts"
      :key="i"
      :content="{title: post.text, description: post.subtitle, image: post.image}"
    />
  </div>
</template>

<script setup lang="ts">
import { PostExtended } from "~~/types/PostExtended";
import { TrendingPostsKv } from "~~/types/TrendingPostsKv";
const trendingPosts = useState("trendingPosts", () => [] as PostExtended[]);

// Executed only by SSR
if (!process.client) {
  const trendingPostsRaw = await TrendingPostsKv.get("1");
  trendingPosts.value = trendingPostsRaw !== false ? trendingPostsRaw.slice(0, trendingPostsRaw.length - 1) : [];
}
</script>
