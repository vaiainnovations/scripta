<template>
  <div class="flex h-full flex-col gap-y-6 overflow-y-scroll bg-background px-4 py-5 md:px-32 lg:py-10 2xl:w-5/6 2xl:px-14 2xl:border border-primary-text-light" @scroll="handleNavbarChange">
    <div class="flex h-6 flex-row items-center justify-start gap-x-4 py-0.5">
      <ArticlesViewTag v-for="tag in tags" :key="tag.i" :content="tag.content" class="w-36" />
      <!-- <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        class="w-5 h-5 col-end-12"
      >
        <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
      </svg> -->
    </div>
    <ArticlesViewContent :title="props.article.text" :subtitle="props.article.subtitle" :content="props.article.content" :address="props.article.author" :date="new Date(props.article.creationDate)" />
    <a v-if="ipfsSourceUrl" :href="ipfsSourceUrl" target="_blank" class="text-xs">IPFS source</a>
    <!--  <div class="grid grid-cols-2 place-content-between gap-y-3 lg:grid-cols-4 lg:gap-x-2">
      <div class="flex flex-row gap-x-1.5 lg:col-span-1">
        <img src="/icons/outline/heart.svg" class="h-5 w-5">
        // TODO: Change font to 15px
        <p class="text-sm font-medium">
          15k <span class="hidden lg:inline">upvotes</span>
        </p>
      </div>
      // TODO: Change font to 15px
      <div class="flex flex-row gap-x-1.5 place-self-end lg:flex-row-reverse lg:place-self-start">
        <p class="text-sm font-medium">
          Tip
        </p>
        <img src="/icons/bold/send-2.svg" class="h-5 w-5">
      </div>
      <div class="flex flex-row gap-x-3 lg:col-end-5 lg:place-self-end">
        // TODO: change icons
        <img src="/svg/social/twitter.svg" class="w-5 object-contain">
        <img src="/svg/social/facebook.svg" class="w-5 object-contain">
        <img src="/svg/social/linkedin.svg" class="w-5 object-contain">
        <img src="/svg/social/link.svg" class="w-5 object-contain">
      </div>
    </div> -->
    <div class="h-11 w-full bg-primary" />
    <div class="flex flex-row">
      <div class="w-full lg:w-7/12 2xl:w-full">
        <!-- <p>Comments</p> -->
      </div>
      <div class="hidden items-center gap-y-2 lg:flex lg:w-5/12 lg:flex-col 2xl:hidden">
        <p class="text-sm font-bold text-primary-text-light">
          Continue your reading
        </p>
        <span v-for="post in (usePostStore().trendings)" :key="post.externalId">
          <NuxtLink :to="`/@${post.author}/${post.externalId}`">
            <SearchArticleCard :post="post" />
          </NuxtLink>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref } from "vue";
import { usePostStore } from "~~/core/store/PostStore";
import { NavBarReadingType } from "~~/layouts/readingCustom.vue";
import { PostExtended } from "~~/types/PostExtended";
import { ArticleSearch } from "~~/types/SearchResults";
import { TagType } from "~~/types/TagType";

interface Props {
  suggestedArticles: Array<{ id: number; content: ArticleSearch }>;
  article: PostExtended;
}
const props = defineProps<Props>();

useHead({
  title: `${props.article.text} - ${props.article.author} on Scripta`
});

const tags = (props.article.tags && props.article.tags.length > 0) ? new Array(props.article.tags.length).fill(0).map((_, i) => ({ i, content: { value: props.article.tags[i] } as TagType })) : [];
let ipfsSourceUrl = "";
if (props.article.entities && (props.article.entities as any).urls) {
  ipfsSourceUrl = (props.article.entities as any)?.urls[0]?.url;
}

const navBarReading : Ref<NavBarReadingType> = inject("navBarReading");
// eslint-disable-next-line vue/no-setup-props-destructure
navBarReading.value.title = props.article.text;
// eslint-disable-next-line vue/no-setup-props-destructure
navBarReading.value.date = new Date(props.article.creationDate);

function handleNavbarChange (event: Event) {
  const { scrollTop } = (event.target as HTMLDivElement);
  if (scrollTop > 120) {
    navBarReading.value.show = true;
  } else {
    navBarReading.value.show = false;
  }
}
</script>
