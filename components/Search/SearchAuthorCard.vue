<template>
  <!-- Flex container on a row -->
  <div class="flex h-fit w-full flex-row items-center justify-start gap-x-1 rounded-xl bg-background-alt py-2 px-1 md:gap-x-3 md:px-2">
    <img :src="props.content.image" class="h-8 rounded-full object-fill">
    <p class="text-xs text-primary-text md:text-base">
      {{ props.content.name }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { AuthorSearch } from "@/types/SearchResults";

interface Props {
  content: AuthorSearch;
}

// TODO props redeclared block scoped
const props = defineProps<Props>();
</script>
