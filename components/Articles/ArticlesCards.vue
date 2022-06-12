<template>
  <div class="md:gap-y-14 md:gap-x-20 md:grid md:grid-cols-2 p-2">
    <div class="md:col-span-2">
      <ArticlesPreview
        :content="content"
      />
    </div>
    <ArticlesSmallPreview
      v-for="article in articles"
      :key="article.id"
      :content="article.content"
    />
  </div>
</template>

<script setup lang="ts">
import { ContentPreviewType } from "@/types/ContentPreviewType";

const title = "Introducing Scripta.network";
const description =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dapibus ante vel nisl consequat tincidunt. Vestibulum et diam nisi. Proin a justo sit amet libero cursus porttitor. Nam lectus enim, volutpat vitae tellus suscipit, dapibus sollicitudin nibh. Maecenas accumsan.";
const image = "/img/author_pic.png";

const content: ContentPreviewType = { title, description, image };

const articles = ref(
  Array(6)
    .fill(0)
    .map((_, i) => ({ id: i, content }))
);

// const containerStyle = (style: string) =>
//   "bg-[#FFFCF9] md:grid md:grid-cols-4 items-center " + style;
</script>
