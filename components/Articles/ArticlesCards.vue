<template>
  <div class="md:gap-y-14 md:gap-x-20 md:grid md:grid-cols-2 p-2">
    <div v-if="trendingPosts.length > 0" class="md:col-span-2">
      <ArticlesPreview :content="trendingPosts[0]" />
    </div>
    <ArticlesSmallPreview
      v-for="(post, i) in trendingPosts.slice(0, trendingPosts.length - 1)"
      :key="i"
      :content="post"
    />
  </div>
</template>

<script setup lang="ts">
import { PostPreview } from "~~/types/PostPreview";
import { TrendingPostsKv } from "~~/types/TrendingPostsKv";
const trendingPosts = useState("trendingPosts", () => [] as PostPreview[]);

// Execute only by SSR
if (!process.client) {
  const trendingPostsRaw = await TrendingPostsKv.get("1");
  trendingPosts.value = trendingPostsRaw !== false ? trendingPostsRaw : [];
}

</script>
