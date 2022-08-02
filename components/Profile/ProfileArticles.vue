<template>
  <div class="bg-[#FFFFFF] flex flex-col gap-y-7 items-center lg:w-2/3 lg:bg-background lg:overflow-y-auto lg:px-32 lg:py-9">
    <div class="h-24 flex flex-row justify-between px-6 w-full items-center bg-background">
      <p class="text-2xl font-semibold">
        Your Articles
      </p>
      <NuxtLink to="/new">
        <img
          src="/icons/bold/add-circle.svg"
          class="w-7 h-7 object-contain"
        >
      </NuxtLink>
    </div>
    <div v-if="usePostStore().userPosts && usePostStore().userPosts.length>0" class="flex flex-col gap-y-9 w-4/5 justify-start items-center lg:w-full lg:gap-y-4">
      <NuxtLink
        v-for="article in usePostStore().userPosts"
        :key="article.externalId"
        class="w-full"
        :to="`/edit/${article.externalId}`"
      >
        <ArticlesSmallPreview :content="{description: article.subtitle, title: article.text, image: article.image, content: article.content, tags: article.tags}" />
      </NuxtLink>
    </div>
    <div v-else>
      <h1 class="text-xl my-auto">
        Create your first article!
      </h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePostStore } from "~~/core/store/PostStore";
</script>
