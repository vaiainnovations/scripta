<template>
  <div class="hidden w-[22%] flex-col items-center justify-start 2xl:flex">
    <div class="h-fit border-b border-primary-text-light px-4 pt-2 pb-1">
      <p class="text-sm font-bold text-primary-text-light">
        Continue your reading
      </p>
    </div>
    <div class="max-h-[90vh]  overflow-y-auto w-full">
      <span
        v-for="post in (usePostStore().trendings)"
        :key="post.externalId"
        class="w-full"
      >
        <NuxtLink :to="`/@${post.author}/${post.externalId}`">
          <ArticlesViewSuggested :post="post" />
        </NuxtLink>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePostStore } from "~~/core/store/PostStore";
</script>
