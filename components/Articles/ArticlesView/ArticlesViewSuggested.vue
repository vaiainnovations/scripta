<template>
  <div class="max-h-fit overflow-hidden border-b border-b-primary-text-light pt-2 pb-2 pl-2.5 pr-14">
    <p class="text-xs font-bold">
      {{ props.content.title }}
    </p>
    <!-- TODO clip paragraph -->
    <p class="block h-8 overflow-hidden text-xs font-light">
      {{ props.content.description }}
    </p>

    <div class="flex flex-row gap-x-3 pt-2 lg:gap-x-2.5">
      <img :src="props.content.author.image" class="h-5 w-5 object-contain">
      <p class="text-sm font-medium text-primary-text-light">
        {{ props.content.author.name }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArticleSearch } from "@/types/SearchResults";

interface Props {
  content: ArticleSearch;
}

const props = defineProps<Props>();
</script>
