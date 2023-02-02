<template>
  <div class="2xl:flex 2xl:flex-row h-full">
    <ArticlesViewSidebar v-if="usePostStore().trendings && usePostStore().trendings.length>0" />
    <div
      v-else
      class="hidden w-[22%] flex-col items-center justify-start 2xl:flex bg-background-alt p-2"
    >
      <div
        v-for="i in 9"
        :key="i"
        class="w-full m-1 p-1"
      >
        <div class="flex">
          <div class="bg-background w-1/4 animate-pulse h-16 rounded-2xl flex my-auto" />
          <div class="bg-background w-3/4 animate-pulse h-8 lg:h-20 rounded-2xl flex ml-2" />
        </div>
      </div>
    </div>
    <div class="flex h-full flex-col bg-background px-4 py-5 md:px-32 lg:py-10 xl:py-0 2xl:w-5/6 2xl:px-14">
      <div class="bg-background-alt w-full animate-pulse h-20 lg:h-16 my-2 rounded-2xl mt-10" />
      <div class="bg-background-alt w-full animate-pulse h-40 lg:h-32 my-2 rounded-2xl" />
      <div class="bg-background-alt w-full animate-pulse h-96 lg:h-96 my-10 rounded-2xl" />
      <div class="bg-background-alt w-full animate-pulse h-20 lg:h-16 my-2 rounded-2xl" />
      <div class="bg-background-alt w-full animate-pulse h-20 lg:h-16 my-2 rounded-2xl" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { usePostStore } from "~~/core/store/PostStore";
</script>
