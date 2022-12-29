<template>
  <!-- Grid container with 6 columns -->
  <NuxtLink
    :to="`/@${article.author}/${article.externalId}`"
    class="grid h-fit w-full grid-cols-5 items-start justify-center gap-x-2 gap-y-0.5 overflow-hidden rounded-2xl bg-background-alt py-2 px-4 md:rounded-3xl"
  >
    <!-- Title of the article, large the entire container -->
    <div class="col-span-5">
      <p class="text-xl font-semibold text-primary-text p-1">
        {{ article.text }}
      </p>
    </div>
    <!-- Image of the article -->
    <div class="col-span-1 rounded-xl bg-[#B4FFFF]/20 py-1 px-1">
      <img
        class="aspect-video h-full max-h-20 object-scale-down"
        :src="articleImage || '/img/author_pic.png'"
        onerror="this.onerror=null;this.src='/img/author_pic.png'"
      >
    </div>
    <!-- Description of the article and author as flex container -->
    <div class="col-span-4 flex flex-col">
      <!-- Description of the article -->
      <div class="max-h-12 overflow-clip lg:max-h-20">
        <p class="text-lg text-primary-text 2xl:text-sm">
          {{ article.subtitle }}
        </p>
      </div>
      <!-- Author of the article -->
      <div class="flex flex-row items-center gap-x-1">
        <p class="flex-grow" />
        <!-- Author name -->
        <p class="text-md text-primary-text-light 2xl:text-sm truncate w-3/5 text-right">
          {{ authorNickname }}
        </p>
        <!-- Author profile picture -->
        <img
          :src="authorImage || '/img/author_pic.png'"
          onerror="this.onerror=null;this.src='/img/author_pic.png'"
          class="h-5 w-5 object-contain rounded-full 2xl:h-6 2xl:w-6"
        >
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { useUserStore } from "~~/core/store/UserStore";
import { PostExtended, searchFirstContentImage } from "~~/types/PostExtended";

interface Props {
  post: PostExtended;
}
const props = defineProps<Props>();

const article = ref(props.post);
const articleImage = ref("/img/author_pic.png");
const authorImage = ref("/img/author_pic.png");
const authorNickname = ref(article.value.author);

const image = searchFirstContentImage(props.post.content);
if (image) {
  articleImage.value = image;
}

useUserStore().$subscribe(() => {
  const authorProfile = useUserStore().users.get(props.post.author);
  if (authorProfile) {
    authorImage.value = authorProfile.pictures?.profile;
    authorNickname.value = authorProfile.nickname;
  }
});
</script>
