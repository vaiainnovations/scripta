<template>
  <span v-if="!isLoading">
    <div class="flex pb-4">
      <img src="/icons/linear/trend-up-circle.svg" class="w-8 h-8">
      <h1 class="ml-2 text-3xl font-extrabold el-icon-arrow-right">
        Trending Articles
      </h1>
    </div>
    <div class="flex">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <NuxtLink
          v-for="x in trendings"
          :key="x.externalId"
          :to="`/@${x.author}/${x.externalId}`"
          class="col-span-1 sm:flex px-4 py-2 my-4 md:my-2 p-1 bg-background-light/20 hover:bg-white/60 rounded-2xl cursor-pointer"
        >
          <img
            class="object-cover my-2 w-2/4 sm:w-1/3 lg:w-36 sm:mx-6 mx-auto rounded-xl h-40 lg:aspect-square aspect-video lg:h-36 flex-none my-auto"
            :src="x.image ||'/img/author_pic.png'"
            onerror="this.src='/img/author_pic.png'"
            loading="lazy"
          >
          <div class="flex-1 my-3 xl:my-4">
            <h2 class="mb-1 text-xl md:text-lg font-bold leading-snug text-gray-800">
              {{ x.text }}
            </h2>
            <p class="text-lg md:text-sm font-normal text-gray-500">
              {{ x.subtitle }}
            </p>
            <div class="py-1">
              <div v-if="(x.tags && x.tags.length>0)" class="flex flex-wrap">
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
            </div>
            <!-- <div
                  v-if="x.author"
                  class="flex pt-3 md:pt-1"
                >
                  <img
                    class="h-6 w-6 rounded-full"
                    :src="x.author.pictures?.profile ||'/img/author_pic.png'"
                    onerror="this.src='/img/author_pic.png'"
                    loading="lazy"
                  >
                  <h6 class="text-xs pl-2 my-auto">
                    {{ x.author?.nickname || x.author?.dtag }}
                  </h6>
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
const trendings = ref([] as PostExtended[]);
const isLoading = ref(true);

// loaded async
onMounted(() => {
  trendings.value = (usePostStore().trendings).slice(0, props.n || 18);
  isLoading.value = false;
});
</script>
