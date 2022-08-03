<template>
  <div class="p-2 md:grid md:grid-cols-2 md:gap-y-14 md:gap-x-10 w-full" :set="trendingPosts = usePostStore().trendings">
    <div
      v-if="trendingPosts.length > 0"
      class="md:col-span-2"
    >
      <NuxtLink :to="`/@${trendingPosts[0].author}/${trendingPosts[0].externalId}`">
        <ArticlesPreview class="col-span-2" :content="{title: trendingPosts[0].text, description: trendingPosts[0].subtitle, image: trendingPosts[0].image, content: trendingPosts[0].content, tags: trendingPosts[0].tags}" />
      </NuxtLink>
    </div>
    <span
      v-for="(post, i) in trendingPosts"
      :key="i"
    >
      <NuxtLink :to="`/@${post.author}/${post.externalId}`">
        <ArticlesSmallPreview :content="{title: post.text, description: post.subtitle, image: post.image, content: post.content, tags: post.tags}" />
      </NuxtLink>
    </span>
  </div>
</template>

<script setup lang="ts">
import { usePostStore } from "~~/core/store/PostStore";
</script>
