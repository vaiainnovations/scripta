<template>
  <div class="bg-[#FFFFFF] flex flex-col gap-y-7 items-center lg:w-2/3 lg:bg-background lg:overflow-y-auto lg:px-32 lg:py-9">
    <div class="h-24 flex flex-row justify-between px-6 w-full items-center bg-background">
      <p class="text-2xl md:text-4xl font-semibold">
        Your Articles
      </p>
      <NuxtLink to="/new">
        <img
          src="/icons/bold/add-circle.svg"
          class="w-7 h-7 object-contain"
        >
      </NuxtLink>
    </div>
    <span v-if="isLoadingArticles" class="flex flex-col gap-y-9 w-4/5 justify-start items-center lg:w-full lg:gap-y-4">
      <SkeletonArticle v-for="n in 4" :key="n" />
    </span>
    <span v-else class="w-2/3 lg:w-full">
      <div
        v-if="usePostStore().userPosts && usePostStore().userPosts.length>0"
        class="flex flex-col gap-y-9 justify-start items-center lg:w-full lg:gap-y-4 w-full"
      >
        <NuxtLink
          v-for="article in usePostStore().userPosts"
          :key="article.externalId"
          class="w-full"
          :to="`/edit/${article.externalId}`"
        >
          <ArticlesSmallPreview :content="{description: article.subtitle, title: article.text, image: article.image, content: article.content, tags: article.tags, id: article.id, analytics: {views: article.post_cnt, upvotes: article.reaction_cnt_1, downvotes: article.reaction_cnt_2}}" />
        </NuxtLink>
      </div>
      <div
        v-else
        class="w-full bg-background-alt p-4 py-8 rounded-2xl"
      >
        <NuxtLink
          to="/new"
          class="w-full bg-background-alt py-10 text-center rounded-2xl"
        >
          <h1 class="text-xl my-auto hover:underline">
            Create your first article!
          </h1>
        </NuxtLink>
      </div>
    </span>
  </div>
</template>

<script setup lang="ts">
import { useAccountStore } from "~~/core/store/AccountStore";
import { usePostStore } from "~~/core/store/PostStore";
import { useUserStore } from "~~/core/store/UserStore";

const isLoadingArticles = ref(true);

useUserStore()
  .getUserArticles(useAccountStore().address)
  .then((posts) => {
    isLoadingArticles.value = false;
    usePostStore().userPosts = posts;
  });
</script>
