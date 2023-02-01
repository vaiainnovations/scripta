<template>
  <div class="flex h-full flex-col gap-y-1 lg:gap-y-4 overflow-y-scroll bg-background px-4 py-5 md:px-32 lg:py-10 xl:py-0 2xl:w-5/6 2xl:px-14" @scroll="handleNavbarChange">
    <div class="text-right w-full">
      <ArticlesActionsOverlay :article="props.article" />
    </div>
    <div class="flex flex-wrap flex-row items-center justify-start pb-0.5 gap-1.5 md:gap-4">
      <ArticlesViewTag v-for="tag in tags" :key="tag.i" :content="tag.content" class="max-w-fit" />
    </div>
    <ArticlesViewContent
      :external-id="props.article.externalId"
      :title="props.article.text"
      :subtitle="props.article.subtitle"
      :content="props.article.content"
      :address="props.article.author.address"
      :date="new Date(props.article.creationDate)"
    />
    <div class="bg-background">
      <div class="mb-3">
        <a v-if="ipfsSourceUrl" :href="ipfsSourceUrl" target="_blank" class="text-xs pr-2 text-gray hover:text-primary-text">IPFS-1</a>
        <a v-if="ipfsSourceAlt" :href="ipfsSourceAlt" target="_blank" class="text-xs pr-2 text-gray hover:text-primary-text">IPFS-2</a>
      </div>
      <div class="grid grid-cols-2 place-content-between gap-y-3 lg:grid-cols-4 xl:grid-cols-12 lg:gap-x-2">
        <div v-if="useAccountStore().address" class="flex flex-row gap-x-1.5 lg:col-span-1">
          <ArticlesReactions :article="props.article" />
        </div>
        <div class="flex flex-row gap-x-1.5 place-self-end lg:flex-row-reverse lg:place-self-start">
          <ArticlesTipsButton :author="props.article.author.address" />
        </div>
        <div class="flex flex-row gap-x-3 lg:col-end-12 lg:place-self-end my-auto">
          <NuxtLayout name="tooltip" :title="'Share on Twitter'" :position="'Bottom'">
            <div @click="shareArticle(`https://twitter.com/intent/tweet?text=${props.article.text}&url=${sharingUrl}`)">
              <img src="/brands/twitter/logo.svg" class="w-5 h-5 object-contain cursor-pointer">
            </div>
          </NuxtLayout>
          <NuxtLayout name="tooltip" :title="'Share on Facebook'" :position="'Bottom'">
            <div @click="shareArticle(`https://www.facebook.com/sharer/sharer.php?u=#${sharingUrl}`)">
              <img src="/brands/facebook/logo.svg" class="w-5 h-5 object-contain cursor-pointer">
            </div>
          </NuxtLayout>
          <NuxtLayout name="tooltip" :title="'Share on Linkedin'" :position="'Bottom'">
            <div @click="shareArticle(`https://www.linkedin.com/sharing/share-offsite/?url=${sharingUrlEncoded}`)">
              <img src="/brands/linkedin/logo.svg" class="w-5 h-5 object-contain cursor-pointer">
            </div>
          </NuxtLayout>
        </div>
      </div>
      <!-- <div class="h-11 w-full bg-primary" /> -->
      <div class="flex flex-row pt-4">
        <div v-if="showComments" class="w-full lg:w-7/12 2xl:w-full">
          <h3 class="text-2xl">
            Comments
          </h3>
          <ArticlesCommentsContainer :referenced-post="article.id" :section-id="article.sectionId" />
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
  </div>
</template>

<script setup lang="ts">
import { Ref } from "vue";
import { useAccountStore } from "~~/core/store/AccountStore";
import { useConfigStore } from "~~/core/store/ConfigStore";
import { useIpfsStore } from "~~/core/store/IpfsStore";
import { usePostStore } from "~~/core/store/PostStore";
import { NavBarReadingType } from "~~/layouts/readingCustom.vue";
import { PostExtended } from "~~/types/PostExtended";
import { TagType } from "~~/types/TagType";

interface Props {
  article: PostExtended;
}
const props = defineProps<Props>();
const showComments = ref(false);
if (process.client) {
  showComments.value = true;
}
const sharingUrl = `https://scripta.network${useRoute().fullPath}`;
const sharingUrlEncoded = encodeURIComponent(sharingUrl);

const tags = (props.article.tags && props.article.tags.length > 0) ? new Array(props.article.tags.length).fill(0).map((_, i) => ({ i, content: { value: props.article.tags[i] } as TagType })) : [];
let ipfsSourceUrl = "";
let ipfsSourceAlt = "";
if (props.article.entities && (props.article.entities as any).urls) {
  ipfsSourceUrl = (props.article.entities as any)?.urls[0]?.url;
  ipfsSourceAlt = useIpfsStore().ipfsUrlToGatewayRead(ipfsSourceUrl) || "";
}

const navBarReading : Ref<NavBarReadingType> = inject("navBarReading");
// eslint-disable-next-line vue/no-setup-props-destructure
navBarReading.value.title = props.article.text;

navBarReading.value.date = new Date(props.article.creationDate);

function handleNavbarChange (event: Event) {
  // disable navbar on small screens
  if (window.innerWidth < 1024) {
    navBarReading.value.show = false;
    return;
  }
  const { scrollTop } = (event.target as HTMLDivElement);
  if (scrollTop > 120) {
    navBarReading.value.show = true;
  } else {
    navBarReading.value.show = false;
  }
}

function shareArticle (fallbackUrl: string) {
  useNuxtApp().$useShare().share(`${useRoute().fullPath}`, fallbackUrl, `${props.article.text}`, `${props.article.subtitle}`);
}
</script>
