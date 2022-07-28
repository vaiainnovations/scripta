<template>
  <div class="flex flex-col items-center overflow-hidden rounded-3xl bg-background-alt shadow-md md:flex-row md:max-h-40 md:gap-x-4 md:w-full border border-primary-text-light">
    <div class="w-80 bg-[#B4FFFF]/20 md:h-full md:w-1/5">
      <img class="h-36 object-cover md:h-32 md:w-full md:object-contain mx-auto" :src="props.content.image">
    </div>
    <div class="flex flex-col justify-start px-4 gap-y-1 md:gap-y-2 pb-2 md:w-4/5">
      <p class="text-lg font-bold md:text-xl text-center md:text-left">
        {{ props.content.title }}
      </p>
      <p class="text-base md:text-xs">
        {{ props.content.description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ContentPreviewType } from "@/types/ContentPreviewType";

interface Props {
  content: ContentPreviewType;
}

const props = defineProps<Props>();
</script>
