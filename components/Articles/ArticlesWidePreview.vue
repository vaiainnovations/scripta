<template>
  <div
    v-if="props.content"
    class="w-full my-4 mx-auto"
  >
    <div class="">
      <NuxtLink
        :to="`/@${props.content.author.dtag || props.content.author.account.dtag || props.content.author.address || props.content.author.account.address || props.content.author}/${props.content.externalId}`"
        class="flex flex-col sm:flex-row px-4 py-2 my-4 md:my-2 p-1 bg-background-alt lg:p-4 lg:px-8 hover:bg-background/50 rounded-2xl cursor-pointer"
      >
        <div class="flex-1 my-3 xl:my-4 order-2 sm:order-1">
          <div class="flex flex-col h-full">
            <div class="flex-grow">
              <h2 class="mb-1 text-xl md:text-3xl font-bold leading-snug text-gray-800">
                {{ props.content.text }}
              </h2>
              <p class="text-lg md:text-xl font-normal text-gray-500">
                {{ props.content.subtitle }}
              </p>
            </div>
            <div class="flex-none bottom-0">
              <div
                v-if="props.content.author"
                class="flex pt-3 md:pt-1"
              >
                <img
                  class="h-6 w-6 rounded-full"
                  :src="props.content.author.pictures?.profile ||'/img/author_pic.png'"
                  onerror="this.src='/img/author_pic.png'"
                  loading="lazy"
                >
                <h6 class="text-xs pl-2 my-auto">
                  {{ props.content.author?.nickname || props.content.author?.dtag }}
                </h6>
              </div>
              <div class="mt-3">
                <div
                  v-if="(props.content.tags && props.content.tags.length>0)"
                  class="flex flex-wrap"
                >
                  <div
                    v-for="tag, index in props.content.tags"
                    :key="index"
                    class="p-0.5"
                  >
                    <TheTag :tag="tag" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <img
          class="mx-auto sm:order-2 object-contain my-2 w-2/4 sm:w-1/3 lg:w-48 sm:mx-6 float-right rounded-xl h-40 aspect-square  lg:h-48 flex-none my-auto"
          :src="props.content.image ||'/img/author_pic.png'"
          onerror="this.src='/img/author_pic.png'"
          loading="lazy"
        >
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PostExtended } from "~~/types/PostExtended";

interface Props {
  content: PostExtended;
}

const props = defineProps<Props>();
</script>
