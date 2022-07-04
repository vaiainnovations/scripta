<template>
  <div class="hidden w-1/6 overflow-y-auto 2xl:flex flex-col justify-start items-center">
    <!-- TODO add border-divide-y -->
    <div class="h-fit pt-2 pb-1 px-4 border-b border-primary-text-light">
      <p class="text-sm font-bold text-primary-text-light">
        Continue your reading
      </p>
    </div>
    <ArticlesViewSuggested v-for="article in suggestedArticles" :key="article" />
  </div>
</template>

<script setup lang="ts">
const suggestedArticles = (new Array(8)).fill(0).map((_, i) => i);
</script>
