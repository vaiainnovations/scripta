<template>
  <div>
    <div class="h-24 flex flex-row justify-between px-6 w-full items-center bg-background">
      <p class="text-2xl md:text-4xl font-semibold">
        Following
      </p>
    </div>
    <span v-if="isLoadingArticles" class="flex flex-col gap-y-9 w-4/5 justify-start items-center lg:w-full lg:gap-y-4">
      <SkeletonArticle v-for="n in 4" :key="n" />
    </span>
    <span v-else class="w-2/3 lg:w-full">
      <div
        v-if="usePostStore().related && usePostStore().related.length>0"
        class="flex flex-col gap-y-9 justify-start items-center lg:w-full lg:gap-y-4 w-full"
      >
        <span
          v-for="article in usePostStore().related"
          :key="article.externalId"
          class="px-5 sm:px-20 lg:px-0 2xl:px-48 w-full"
        >
          <NuxtLink :to="`/@${article.author.address || article.author || ''}/${article.externalId}`">
            <ArticlesSmallPreview :content="{description: article.subtitle, title: article.text, image: article.image, content: article.content, tags: article.tags, id: article.id}" />
          </NuxtLink>
        </span>
      </div>
    </span>
  </div>
</template>

<script setup lang="ts">
import { useAccountStore } from "~~/core/store/AccountStore";
import { usePostStore } from "~~/core/store/PostStore";
import { useUserStore } from "~~/core/store/UserStore";

const isLoadingArticles = ref(true);

usePostStore().getRelatedPosts().then(() => {
  isLoadingArticles.value = false;
});
</script>
