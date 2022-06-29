<template>
  <div class="bg-background-alt flex flex-row justify-start items-center gap-x-1 w-full h-fit rounded-2xl py-2 md:rounded-xl px-1 md:gap-x-3 md:px-2">
    <img :src="props.content.image" class="object-fill h-8 rounded-full">
    <p class="text-primary-text text-xs md:text-base">
      {{ props.content.name }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { AuthorSearch } from "@/types/SearchResults";

interface Props {
  content: AuthorSearch
}

// TODO props redeclared block scoped
const props = defineProps<Props>();
</script>
