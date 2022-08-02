<template>
  <div class="bg-[#FFFFFF] flex flex-col gap-y-7 items-center lg:w-2/3 lg:bg-background lg:overflow-y-auto lg:px-32 lg:py-9">
    <div v-if="props.articles && props.articles.length>0" class="flex flex-col gap-y-9 w-4/5 justify-start items-center lg:w-full lg:gap-y-4">
      <NuxtLink
        v-for="article in props.articles.slice().reverse()"
        :key="article.externalId"
        class="w-full"
        :to="`/@${article.author}/${article.externalId}`"
      >
        <ArticlesSmallPreview v-if="article" :content="{description: article.subtitle, title: article.text, image: article.image, content: article.content, tags: article.tags}"/>
      </NuxtLink>
    </div>
    <div v-else>
      <h1 class="text-3xl my-auto font-bold">Ops, nothing found here</h1>
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
