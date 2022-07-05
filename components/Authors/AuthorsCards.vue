<template>
  <div class="md:gap-x-10">
    <!-- <ContentPreview
      v-for="author in authors"
      :key="author.id"
      :content="author.content"
      class="md:max-w-32 items-center bg-[#FCF4E8]"
    /> -->
    <AuthorsPreview v-for="author in authors" :key="author.id" :content="author.content" />
  </div>
</template>

<script setup lang="ts">
import { ContentPreviewType } from "@/types/ContentPreviewType";

const title = "Nick";
const description =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dapibus ante vel nisl consequat tincidunt. Vestibulum et diam nisi. Proin a justo sit amet libero cursus porttitor.";
const image = "/img/author_pic.png";

const content: ContentPreviewType = { title, description, image };

const authors = ref(
  Array(8)
    .fill(0)
    .map((_, i) => ({ id: i, content }))
);
</script>
