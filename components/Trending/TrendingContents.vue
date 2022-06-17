<template>
  <div class="flex flex-col px-8 md:px-24 2xl:px-96 gap-y-12">
    <TrendingTitle>
      <slot />
    </TrendingTitle>
    <div class="flex overflow-x-scroll md:overflow-x-auto">
      <AuthorsCards v-if="props.isAuthor" :class="container" />
      <ArticlesCards v-else :class="container" />
    </div>
  </div>
</template>

<script setup lang="ts">
const container = "flex flex-nowrap gap-x-20";

interface Props {
  isAuthor?: boolean;
}

const props = defineProps<Props>();
</script>
