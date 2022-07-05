<template>
  <div class="mb-10 flex max-w-xs flex-col items-center overflow-hidden rounded-3xl bg-background shadow-md">
    <div class="w-60 bg-[#B4FFFF]/20">
      <img class="mx-auto h-36 object-cover object-center" :src="props.content.image">
    </div>
    <div class="space-y-1 py-4 px-4 text-center">
      <p class="text-2xl font-medium">
        {{ props.content.title }}
      </p>
      <p class="text-sm">
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
