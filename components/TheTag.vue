<template>
  <span>
    <NuxtLink :to="`/tag/${tag}`" class="text-xs sm:text-sm md:text-base bg-gray-light hover:bg-gray-light/70 rounded-lg px-4 lg:px-8 py-0.5 lg:py-1 cursor-pointer whitespace-nowrap">
      {{ props.tag }}
    </NuxtLink>
  </span>
</template>

<script setup lang="ts">
interface Props {
  tag: string;
}

const props = defineProps<Props>();
</script>
