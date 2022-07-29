<template>
  <div class="bg-[#FFFFFF] flex flex-col gap-y-7 items-center lg:w-2/3 lg:bg-background lg:overflow-y-auto lg:px-32 lg:py-9">
    <div class="flex flex-col gap-y-9 w-4/5 justify-start items-center lg:w-full lg:gap-y-4">
      <NuxtLink
        v-for="article in props.articles.slice().reverse()"
        :key="article.external_id"
        class="w-full"
        :to="`/${article.author}/${article.external_id}`"
      >
        <ArticlesSmallPreview :content="{description: article.external_id, title: article.text, image: ''}" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PostExtended } from "~~/types/PostExtended";

type Props = {
  articles: PostExtended[]
}

const props = defineProps<Props>();
</script>
