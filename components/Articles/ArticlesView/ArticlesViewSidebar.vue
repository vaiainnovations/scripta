<template>
  <div class="hidden w-[22%] flex-col items-center justify-start 2xl:flex bg-background-alt m-1 rounded-2xl">
    <div class="h-fit px-4 pt-2">
      <p class="text-primary-text-light tracking-wide">
        Continue your reading
      </p>
    </div>
    <div class="max-h-[90vh] overflow-y-auto w-full">
      <div
        v-for="post in (usePostStore().trendings)"
        :key="post.externalId"
        class="w-full"
      >
        <NuxtLink :to="post.author?.dtag ? `/@${post.author.dtag}/${post.externalId}` : `/@${post.author}/${post.externalId}`">
          <ArticlesViewSuggested :post="post" />
        </NuxtLink>
        <div />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePostStore } from "~~/core/store/PostStore";
</script>
