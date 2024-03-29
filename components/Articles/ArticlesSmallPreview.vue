<template>
  <div
    v-if="props.content"
    class="w-full my-4 mx-auto"
  >
    <!-- Desktop -->
    <div class=" mx-auto hidden sm:block">
      <div class="flex max-w-full mx-auto overflow-hidden bg-background-alt rounded-2xl shadow-md dark:bg-gray-800">
        <div class="w-1/3 h-48">
          <ImageWrapper
            :img-url="props.content.image"
            :img-class="'w-full h-full object-contain bg-[#FFFF]'"
            alt="Article cover picture"
          />
        </div>

        <div class="w-2/3 p-4 md:p-4">
          <div class="flex flex-col h-full flex-nowrap">
            <div class="w-full align-top mb-auto">
              <a
                v-if="props.content.id <= 0"
                class="rounded-2xl bg-primary-light text-xs font-medium text-background px-2 py-1 float-right"
              >
                Draft
              </a>
              <p class="mb-2 text-sm text-gray-600 dark:text-gray-400">
                <a
                  v-for="tag in props.content.tags"
                  :key="tag"
                  class="text-xs mr-2 text-primary-text/70"
                >
                  #{{ tag }}
                </a>
              </p>
              <h1 class="text-2xl font-bold text-gray-800">
                {{ props.content.title }}
              </h1>

              <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {{ props.content.description }}
              </p>
            </div>

            <div
              v-if="props.content.analytics && props.content.id > 0"
              class="mt-auto self-end flex"
            >
              <div class="flex">
                <img src="/icons/linear/eye.svg" class="h-5 mx-1">
                {{ shortNumber(props.content.analytics.views) }}
              </div>

              <div class="flex">
                <img src="/icons/linear/message.svg" class="h-5 mx-1.5">
                {{ shortNumber(props.content.analytics.comments) }}
              </div>

              <div class="flex">
                <div class="w-1 h-1 bg-primary-text rounded-full mx-1.5 my-auto" />
              </div>

              <div class="flex mx-1.1">
                <ArticlesUpvote :reacted="true" />
                {{ shortNumber(props.content.analytics.upvotes) }}
              </div>

              <div class="flex">
                <ArticlesDownvote :reacted="true" />
                {{ shortNumber(props.content.analytics.downvotes) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile -->
    <div class="w-full mx-auto block sm:hidden">
      <div class="overflow-hidden shadow-lg rounded-3xl md:w-80 cursor-pointer m-auto">
        <div class="w-full h-full">
          <ImageWrapper :img-url="props.content.image" :img-class="'max-h-56 w-full object-contain'" alt="Article cover picture" />
          <div class="bg-background-alt dark:bg-gray-800 w-full p-4">
            <a
              v-if="props.content.id <= 0"
              class="rounded-2xl bg-primary-light text-xs font-medium text-background px-2 py-1 float-right"
            >
              Draft
            </a>
            <p class="text-primary-text text-xl font-medium mb-2">
              {{ props.content.title }}
            </p>
            <p class="text-primary-text/80 font-light text-md">
              {{ props.content.description }}
            </p>
            <div class="flex items-center mt-4">
              <div class="flex flex-wrap justify-starts items-center mt-4">
                <div
                  v-for="tag in props.content.tags"
                  :key="tag"
                  class="text-xs mr-2 py-1.5 px-4 text-gray-600 bg-blue-100 rounded-2xl"
                >
                  #{{ tag }}
                </div>
              </div>
            </div>
            <div
              v-if="props.content.analytics && props.content.id > 0"
              class="mt-auto self-end flex float-right m-2"
            >
              <div class="flex">
                <img src="/icons/linear/eye.svg" class="h-5 mx-1">
                {{ shortNumber(props.content.analytics.views) }}
              </div>

              <div class="flex">
                <img src="/icons/linear/message.svg" class="h-5 mx-1.5">
                {{ shortNumber(props.content.analytics.comments) }}
              </div>

              <div class="flex">
                <div class="w-1 h-1 bg-primary-text rounded-full mx-1.5 my-auto" />
              </div>

              <div class="flex">
                <ArticlesUpvote :reacted="true" />
                {{ shortNumber(props.content.analytics.upvotes) }}
              </div>

              <div class="flex mx-1.5">
                <ArticlesDownvote :reacted="true" />
                {{ shortNumber(props.content.analytics.downvotes) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ContentPreviewType } from "@/types/ContentPreviewType";

interface Props {
  content: ContentPreviewType;
}

const props = defineProps<Props>();

function shortNumber (v: number) {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(v);
}
</script>
