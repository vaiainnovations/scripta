<template>
  <div v-if="props.content" class="w-full py-4 mx-auto">
    <!-- Desktop -->
    <div class="max-w-7xl lg:max-w-2xl mx-auto hidden md:block">
      <div class="flex max-w-full mx-auto overflow-hidden bg-background-alt rounded-3xl shadow-md dark:bg-gray-800">
        <div class="w-1/3 h-40">
          <img
            alt="Article cover picture"
            :src="props.content.image"
            class="w-full h-full object-cover bg-[#FFFF]"
          >
        </div>

        <div class="w-2/3 p-4 md:p-4">
          <p class="mb-2 text-sm text-gray-600 dark:text-gray-400">
            <a
              v-for="tag in props.content.tags"
              :key="tag"
              class="text-xs mr-2 text-primary-text/70"
            >
              #{{ tag }}
            </a>
          </p>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
            {{ props.content.title }}
          </h1>

          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {{ props.content.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Mobile -->
    <div class="w-fit mx-auto block md:hidden">
      <div class="overflow-hidden shadow-lg rounded-3xl w-80 cursor-pointer m-auto">
        <div class="w-full h-full">
          <img
            alt="Article cover picture"
            :src="props.content.image"
            class="max-h-56 w-full object-cover"
          >
          <div class="bg-background-alt dark:bg-gray-800 w-full p-4">
            <p class="text-primary-text dark:text-white text-xl font-medium mb-2">
              {{ props.content.title }}
            </p>
            <p class="text-primary-text/80 dark:text-gray-300 font-light text-md">
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
</script>
