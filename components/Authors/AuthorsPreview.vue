<template>
  <div class="bg-[#FCF4E8] shadow-lg overflow-hidden flex flex-col items-center rounded-3xl border border-solid max-w-xs">
    <div class="bg-[#B4FFFF]/20 w-60">
      <img
        class="object-cover h-36 object-center"
        :src="props.content.image"
      >
    </div>
    <div class="space-y-4 py-4 px-6 text-center">
      <p class="text-xl font-extrabold font-sans">
        {{ props.content.title }}
      </p>
      <p class="text-xs font-sans">
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
