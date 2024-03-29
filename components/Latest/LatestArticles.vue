<template>
  <span v-if="!isLoading && latest.length > 0">
    <div class="flex pb-4">
      <img src="/icons/linear/clock.svg" class="w-8 h-8">
      <h1 class="ml-2 text-3xl font-extrabold el-icon-arrow-right">
        Latest Articles
      </h1>
    </div>
    <div class="flex">
      <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-2 w-full">
        <NuxtLink
          v-for="x in latest"
          :key="x.externalId"
          :to="x.author?.dtag ? `/@${x.author.dtag}/${x.externalId}` : `/@${x.author}/${x.externalId}`"
          class="col-span-1 sm:flex px-4 py-2 my-4 md:my-2 p-1 bg-background-light/20 hover:bg-white/60 rounded-2xl cursor-pointer group"
        >
          <ImageWrapper
            :img-url="x.image ||'/img/author_pic.png'"
            :img-class="'object-cover my-auto mx-auto lg:float-right rounded-xl h-32 lg:aspect-square aspect-video lg:h-28'"
          />
          <div class="flex-1 lg:pl-4 pl-4 md:pl-0 pt-2 md:pt-0">
            <h2
              class="mb-1 text-xl md:text-lg font-semibold text-gray-800"
              :class="x.text.length>50?'sm:group-hover:truncate sm:group-hover:text-base sm:group-hover:w-80':''"
            >
              {{ x.text }}
            </h2>
            <p class="text-sm md:text-sm font-normal text-gray-500" :class="x.text.length>50?'sm:group-hover:block sm:hidden':'block'">
              {{ x.subtitle.length<=90? x.subtitle : x.subtitle.substring(0,90) + '...' }}
            </p>
            <!-- <div class="py-1">
              <div v-if="(x.tags && x.tags.length>0)" class="flex flex-nowrap overflow-hidden">
                <div
                  v-for="tag, index in x.tags"
                  :key="index"
                  class="p-0.5"
                >
                  <div
                    class="text-xs text-extralight text-primary-text-light"
                  >
                    #{{ tag }}
                  </div>
                </div>
              </div>
            </div> -->
          </div>
        </NuxtLink>
      </div>
    </div>
  </span>
  <span v-else>
    <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-2 w-full">
      <div v-for="x in 12" :key="x" class="col-span-1 m-3">
        <div class="bg-background w-full animate-pulse h-32 rounded-2xl" />
      </div>
    </div>
  </span>
</template>

<script setup lang="ts">
import { usePostStore } from "~~/core/store/PostStore";
import { PostExtended } from "~~/types/PostExtended";
  interface Props {
    n?: number;
  }

const props = defineProps<Props>();
const isLoading = ref(true);
const latest = ref([] as PostExtended[]);

// loaded async
onMounted(async () => {
  latest.value = (await usePostStore().getLatestPosts()).slice(0, props.n || 18);
  isLoading.value = false;
});
</script>
