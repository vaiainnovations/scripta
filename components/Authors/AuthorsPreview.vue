<template>
  <div class="bg-background shadow-md overflow-hidden flex flex-col items-center rounded-3xl  max-w-xs mb-10">
    <div class="bg-[#B4FFFF]/20 w-60">
      <img
        class="object-cover h-36 object-center mx-auto"
        :src="props.content.image"
      >
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
