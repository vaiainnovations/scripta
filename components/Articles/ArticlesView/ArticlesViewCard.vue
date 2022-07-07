<template>
  <div class="flex h-full flex-col gap-y-6 overflow-y-scroll bg-background px-4 py-5 md:px-32 lg:py-20 2xl:w-5/6 2xl:px-14">
    <div class="flex h-6 flex-row items-center justify-start gap-x-4 py-0.5">
      <ArticlesViewTag v-for="tag in tags" :key="tag.i" :content="tag.content" />
      <!-- <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        class="w-5 h-5 col-end-12"
      >
        <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
      </svg> -->
    </div>
    <ArticlesViewContent />
    <div class="grid grid-cols-2 place-content-between gap-y-3 lg:grid-cols-4 lg:gap-x-2">
      <div class="flex flex-row gap-x-1.5 lg:col-span-1">
        <img src="/icons/outline/heart.svg" class="h-5 w-5">
        <!-- Change font to 15px -->
        <p class="text-sm font-medium">
          15k <span class="hidden lg:inline">upvotes</span>
        </p>
      </div>
      <!-- Change font to 15px -->
      <div class="flex flex-row gap-x-1.5 place-self-end lg:flex-row-reverse lg:place-self-start">
        <p class="text-sm font-medium">
          Tip
        </p>
        <img src="/icons/bold/send-2.svg" class="h-5 w-5">
      </div>
      <div class="flex flex-row gap-x-3 lg:col-end-5 lg:place-self-end">
        <!-- TODO:  change icons -->
        <img src="/svg/social/twitter.svg" class="w-5 object-contain">
        <img src="/svg/social/facebook.svg" class="w-5 object-contain">
        <img src="/svg/social/linkedin.svg" class="w-5 object-contain">
        <img src="/svg/social/link.svg" class="w-5 object-contain">
      </div>
    </div>
    <div class="h-11 w-full bg-primary" />
    <div class="flex flex-row">
      <div class="w-full lg:w-7/12 2xl:w-full">
        <p>Comments</p>
      </div>
      <div class="hidden items-center gap-y-2 lg:flex lg:w-5/12 lg:flex-col 2xl:hidden">
        <p class="text-sm font-bold text-primary-text-light">
          Continue reading
        </p>
        <SearchArticleCard v-for="result in props.suggestedArticles" :key="result.id" :content="result.content" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArticleSearch } from "~~/types/SearchResults";

interface Props {
  suggestedArticles: Array<{ id: number; content: ArticleSearch }>;
}
const props = defineProps<Props>();

const tags = new Array(3).fill(0).map((_, i) => ({ i, content: `Tag${i + 1}` }));
</script>
