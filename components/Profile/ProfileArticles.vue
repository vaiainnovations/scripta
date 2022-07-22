<template>
  <div class="bg-[#FFFFFF] flex flex-col gap-y-7 items-center lg:w-2/3 lg:bg-background lg:overflow-y-auto lg:px-32 lg:py-9">
    <div class="h-24 flex flex-row justify-between px-6 w-full items-center bg-background">
      <p class="text-2xl font-semibold">
        Your Articles
      </p>
      <NuxtLink to="/newarticle">
        <img src="/icons/bold/add-circle.svg" class="w-7 h-7 object-contain">
      </NuxtLink>
    </div>
    <div class="flex flex-col gap-y-9 w-4/5 justify-start items-center lg:w-full lg:gap-y-4">
      <ArticlesSmallPreview
        v-for="article in articles"
        :key="article.id"
        :content="article.content"
      />
    </div>
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
</script>
