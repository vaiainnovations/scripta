<template>
  <div
    class="m-2 flex flex-col items-center overflow-hidden rounded-3xl bg-background-alt shadow-md md:grid md:max-h-40 md:grid-cols-4 md:gap-x-4"
  >
    <div class="w-80 bg-[#B4FFFF]/20 md:col-span-1 md:h-full md:w-full">
      <img class="h-36 object-cover md:h-40 md:w-full md:object-contain" :src="props.content.image">
    </div>
    <div class="space-y-4 py-4 px-6 text-center md:col-span-3 md:space-y-4 md:px-0 md:text-left">
      <p class="font-sans text-lg font-extrabold md:text-xl">
        {{ props.content.title }}
      </p>
      <p class="font-sans text-base md:text-xs">
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
