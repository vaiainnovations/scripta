<template>
  <!-- Flex container on a row -->
  <NuxtLink
    :to="`/@${author.dtag}`"
    class="flex h-fit w-full flex-row items-center justify-start gap-x-1 rounded-xl bg-background-alt py-2 px-1 md:gap-x-3 md:px-2 cursor-pointer"
  >
    <ImageWrapper
      :img-url="props.author.profile || '/img/author_pic.png'"
      :img-class="'max-w-11 w-11 h-11 object-cover rounded-full border border-background'"
    />
    <p class="pl-3 text-xl text-primary-text md:text-base truncate">
      <span v-if="props.author.nickname">
        {{ props.author.dtag }}
      </span>
      <span v-else>
        @{{ props.author.dtag }}
      </span>
    </p>
  </NuxtLink>
</template>

<script setup lang="ts">
import { AuthorSearch } from "@/types/SearchResults";

interface Props {
  author: AuthorSearch;
}

const props = defineProps<Props>();
</script>
