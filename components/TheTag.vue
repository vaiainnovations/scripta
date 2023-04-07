<template>
  <span>
    <NuxtLink :to="`/tag/${tag}`" :class="tagStyle">
      {{ props.tag }}
    </NuxtLink>
  </span>
</template>

<script setup lang="ts">
interface Props {
  tag: string;
  mode?: "default" | "small"
}

const props = defineProps<Props>();

let tagStyle = "text-xs sm:text-sm md:text-base bg-gray-light hover:bg-gray-light/70 rounded-lg px-4 lg:px-8 py-0.5 lg:py-1 cursor-pointer whitespace-nowrap";
if (props.mode === "small") {
  tagStyle = "text-xs md:text-sm bg-background hover:bg-background/70 hover:text-primary-text-light rounded-lg px-3 lg:px-5 py-0.5 lg:py-0.5 cursor-pointer whitespace-nowrap";
}
</script>
