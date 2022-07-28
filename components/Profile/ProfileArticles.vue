<template>
  <div class="bg-[#FFFFFF] flex flex-col gap-y-7 items-center lg:w-2/3 lg:bg-background lg:overflow-y-auto lg:px-32 lg:py-9">
    <div class="h-24 flex flex-row justify-between px-6 w-full items-center bg-background">
      <p class="text-2xl font-semibold">
        Your Articles
      </p>
      <NuxtLink to="/newarticle">
        <img
          src="/icons/bold/add-circle.svg"
          class="w-7 h-7 object-contain"
        >
      </NuxtLink>
    </div>
    <div v-if="usePostStore().userPosts && usePostStore().userPosts.length>0" class="flex flex-col gap-y-9 w-4/5 justify-start items-center lg:w-full lg:gap-y-4">
      <NuxtLink
        v-for="article in usePostStore().userPosts"
        :key="article.external_id"
        class="w-full"
        :to="`/${useAccountStore().profile.dtag}/${article.external_id}`"
      >
        <ArticlesSmallPreview :content="{description: article.subtitle, title: article.text, image: ''}" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAccountStore } from "~~/core/store/AccountStore";
import { usePostStore } from "~~/core/store/PostStore";
</script>
