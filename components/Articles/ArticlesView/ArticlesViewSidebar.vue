<template>
  <div class="hidden w-1/6 flex-col items-center justify-start 2xl:flex">
    <div class="h-fit border-b border-primary-text-light px-4 pt-2 pb-1">
      <p class="text-sm font-bold text-primary-text-light">
        Continue your reading
      </p>
    </div>
    <ArticlesViewSuggested v-for="result in props.suggestedArticles" :key="result.id" :content="result.content" />
  </div>
</template>

<script setup lang="ts">
import { ArticleSearch } from "~~/types/SearchResults";

interface Props {
  suggestedArticles: Array<{ id: number; content: ArticleSearch }>;
}

const props = defineProps<Props>();
</script>
