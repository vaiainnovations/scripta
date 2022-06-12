<template>
  <div class="bg-background-alt shadow-md overflow-hidden flex flex-col items-center rounded-3xl  md:max-h-40 md:gap-x-4 md:grid md:grid-cols-4 m-2">
    <div class="bg-[#B4FFFF]/20 md:col-span-1 w-80 md:w-full md:h-full">
      <img
        class="object-cover h-36 md:object-contain md:w-full md:h-40"
        :src="props.content.image"
      >
    </div>
    <div class="space-y-4 text-center md:space-y-4 py-4 px-6 md:col-span-3 md:px-0 md:text-left">
      <p class="text-lg font-extrabold font-sans md:text-xl">
        {{ props.content.title }}
      </p>
      <p class="text-base font-sans md:text-xs">
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
