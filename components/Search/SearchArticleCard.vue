<template>
  <!-- TODO same padding as authorcard -->
  <!-- Grid container with 6 columns -->
  <div
    class="grid h-fit w-full grid-cols-5 items-start justify-center gap-x-2 gap-y-0.5 overflow-hidden rounded-2xl bg-background-alt py-2 px-4 md:rounded-xl"
  >
    <!-- Title of the article, large the entire container -->
    <div class="col-span-5">
      <p class="text-sm font-semibold text-primary-text">
        {{ props.content.title }}
      </p>
    </div>
    <!-- Image of the article -->
    <!-- TODO probably the bg should be removed with real images -->
    <div class="col-span-1 rounded-xl bg-[#B4FFFF]/20 py-1 px-1">
      <img class="aspect-square h-full object-contain" :src="props.content.image">
    </div>
    <!-- Description of the article and author as flex container -->
    <div class="col-span-4 flex flex-col">
      <!-- Description of the article -->
      <div class="max-h-12 overflow-clip lg:max-h-20">
        <!-- TODO add 8px to xxs in tailwind config -->
        <p class="text-[8px] text-primary-text 2xl:text-sm">
          {{ props.content.description }}
        </p>
      </div>
      <!-- Author of the article -->
      <div class="flex flex-row items-center gap-x-1 self-end">
        <!-- TODO add 9px in tailwind config -->
        <!-- Author name -->
        <p class="text-[9px] text-primary-text-light 2xl:text-sm">
          {{ props.content.author.name }}
        </p>
        <!-- Author profile picture -->
        <img :src="props.content.author.image" class="h-3 w-3 object-contain lg:h-4 lg:w-4 2xl:h-5 2xl:w-5">
      </div>
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
