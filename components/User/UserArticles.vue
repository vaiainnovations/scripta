<template>
  <div class="bg-[#FFFFFF] flex flex-col gap-y-7 items-center lg:w-2/3 lg:bg-background lg:overflow-y-auto lg:px-32 lg:py-9">
    <span
      v-if="isLoadingArticles"
      class="flex flex-col gap-y-9 w-4/5 justify-start items-center lg:w-full lg:gap-y-4"
    >
      <SkeletonArticle
        v-for="n in 4"
        :key="n"
      />
    </span>
    <span v-else>
      <div
        v-if="articles && articles.length>0"
        class="flex flex-col gap-y-9 w-4/5 justify-start items-center lg:w-full lg:gap-y-4 mx-auto"
      >
        <NuxtLink
          v-for="article in articles"
          :key="article.externalId"
          class="w-full"
          :to="`/@${props.user?.dtag || article.author}/${article.externalId}`"
        >
          <ArticlesSmallPreview
            v-if="article"
            :content="{description: article.subtitle, title: article.text, image: article.image, content: article.content, tags: article.tags}"
          />
        </NuxtLink>
      </div>
      <div v-else>
        <h1 class="text-3xl my-auto font-bold">Ops, nothing found here</h1>
      </div>
    </span>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~~/core/store/UserStore";
import { PostExtended } from "~~/types/PostExtended";

type Props = {
  user: any;
};

const props = defineProps<Props>();
const articles = ref([] as PostExtended[]);

const isLoadingArticles = ref(true);
if (process.client && props.user && props.user.account) {
  const address = props.user.account.base_vesting_account?.base_account?.address || props.user.account.address || props.user;
  useUserStore()
    .getUserArticles(address)
    .then((posts) => {
      isLoadingArticles.value = false;
      articles.value = posts;
    });
}
</script>
