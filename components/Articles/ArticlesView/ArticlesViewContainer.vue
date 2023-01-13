<template>
  <!-- Container for reading an article, with a sidebar on larger screens (>= 1536 px)  -->
  <div v-if="post" class="2xl:flex 2xl:flex-row h-full">
    <ArticlesViewSidebar />
    <ArticlesViewCard :article="props.post" />
  </div>
</template>

<script setup lang="ts">
// content of the article
import { PostExtended } from "~~/types/PostExtended";

interface Props {
  post: PostExtended;
}

const props = defineProps<Props>();

</script>
