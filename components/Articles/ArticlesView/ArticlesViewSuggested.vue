<template>
  <div class="max-h-fit overflow-hidden border-b border-b-primary-text-light pt-2 pb-2 pl-2.5 pr-14">
    <p class="text-xs font-bold">
      {{ props.post.text }}
    </p>
    <p class="block h-8 overflow-hidden text-xs font-light">
      {{ props.post.subtitle }}
    </p>

    <div class="flex flex-row gap-x-3 pt-2 lg:gap-x-2.5">
      <img :src="authorImage" class="h-7 w-7 object-cover rounded-full">
      <p class="text-sm font-medium text-primary-text-light">
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
