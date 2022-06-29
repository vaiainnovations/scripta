<template>
  <!-- TODO same padding as authorcard -->
  <div class="bg-background-alt overflow-hidden flex flex-col items-start justify-center rounded-2xl h-fit py-2 px-2 w-full">
    <div class="self-start">
      <p class="text-sm font-semibold">
        {{ props.content.title }}
      </p>
    </div>
    <div class="flex flex-row gap-x-1">
      <div class="bg-[#B4FFFF]/20 min-h-fit min-w-fit h-fit w-fit rounded-xl">
        <img
          class="object-contain aspect-square w-14 lg:w-24 min-w-fit h-14 lg:h-24 min-h-fit"
          :src="props.content.image"
        >
      </div>
      <div class="flex flex-col">
        <div class="max-h-12 lg:max-h-20 overflow-clip">
          <!-- TODO add 8px to xxs in tailwind config -->
          <p class="text-[8px] lg:text-sm">
            {{ props.content.description }}
          </p>
        </div>
        <div class="self-end flex flex-row items-center gap-x-1">
          <p class="text-[9px] text-primary-text-light xl:text-sm">
            {{ props.content.author.name }}
          </p>
          <img :src="props.content.author.image" class="w-3 h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5 object-contain">
        </div>
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
