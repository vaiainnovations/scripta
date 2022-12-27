<template>
  <div class="max-h-fit overflow-hidden border-b border-b-primary-text-light pt-2 pb-2 pl-2.5">
    <div class="w-full flex">
      <div class="w-1/4">
        <img
          :src="props.post.image"
          onerror="this.onerror=null;this.src='/img/author_pic.png'"
          class="w-full p-1 my-auto mx-auto object-contain max-h-14 rounded-xl"
        >
      </div>
      <div class="w-3/4">
        <p class="text-[1.07rem] font-bold">
          {{ props.post.text }}
        </p>
        <p class="block h-full max-h-14 overflow-hidden text-sm font-light">
          {{ props.post.subtitle }}
        </p>
      </div>
    </div>
    <div class="w-full flex">
      <img
        :src="authorImage"
        onerror="this.onerror=null;this.src='/img/author_pic.png'"
        class="h-6 w-6 object-cover rounded-full mx-1"
      >
      <p class="text-sm font-medium text-primary-text-light my-auto truncate mx-2">
        {{ authorNickname }}
      </p>
    </div>
  </div>
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
  resolveArticlesUser();
});
resolveArticlesUser();

function resolveArticlesUser () {
  const authorProfile = useUserStore().users.get(props.post.author);
  if (authorProfile) {
    authorImage.value = authorProfile.pictures?.profile;
    authorNickname.value = authorProfile.nickname;
  }
}
</script>
