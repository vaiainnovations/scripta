<template>
  <div class="flex h-full flex-col gap-y-6 overflow-y-scroll bg-background px-4 py-5 md:px-32 lg:py-10 2xl:w-5/6 2xl:px-14 2xl:border border-primary-text-light" @scroll="handleNavbarChange">
    <div class="text-right w-full">
      <ArticlesActionsOverlay :article="props.article" />
    </div>
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
    <ArticlesViewContent
      :external-id="props.article.externalId"
      :title="props.article.text"
      :subtitle="props.article.subtitle"
      :content="props.article.content"
      :address="props.article.author.address"
      :date="new Date(props.article.creationDate)"
    />
    <div class="bg-background">
      <div>
        <a v-if="ipfsSourceUrl" :href="ipfsSourceUrl" target="_blank" class="text-xs">IPFS source</a>
      </div>
      <div class="grid grid-cols-2 place-content-between gap-y-3 lg:grid-cols-4 xl:grid-cols-12 lg:gap-x-2">
        <div class="flex flex-row gap-x-1.5 lg:col-span-1">
          <button class="group p-1.5 rounded-full hover:bg-background-alt/40" @click="handleReaction(':up:')">
            <ArticlesUpvote :reacted="userReaction?.code === ':up:'" />
          </button>
          <button class="group p-1.5 rounded-full hover:bg-background-alt/40" @click="handleReaction(':down:')">
            <ArticlesDownvote :reacted="userReaction?.code === ':down:'" />
          </button>
        </div>
        <div class="flex flex-row gap-x-1.5 place-self-end lg:flex-row-reverse lg:place-self-start">
          <ArticlesTipsButton :author="props.article.author.address" />
        </div>
        <div class="flex flex-row gap-x-3 lg:col-end-12 lg:place-self-end my-auto">
          <a
            target="_blank"
            :href="`https://twitter.com/intent/tweet?text=${props.article.text}&url=${sharingUrl}`"
          >
            <img src="/brands/twitter/logo.svg" class="w-5 h-5 object-contain">
          </a>
          <a
            target="_blank"
            :href="`https://www.facebook.com/sharer/sharer.php?u=#${sharingUrl}`"
          >
            <img src="/brands/facebook/logo.svg" class="w-5 h-5 object-contain">
          </a>
          <a
            target="_blank"
            :href="`https://www.linkedin.com/sharing/share-offsite/?url=${sharingUrlEncoded}`"
          >
            <img src="/brands/linkedin/logo.svg" class="w-5 h-5 object-contain">
          </a>
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
import { useConfigStore } from "~~/core/store/ConfigStore";
import { usePostStore } from "~~/core/store/PostStore";
import { ArticleReaction } from "~~/core/store/ReactionStore";
import { NavBarReadingType } from "~~/layouts/readingCustom.vue";
import { PostExtended, searchFirstContentImage } from "~~/types/PostExtended";
import { ArticleSearch } from "~~/types/SearchResults";
import { TagType } from "~~/types/TagType";

interface Props {
  suggestedArticles: Array<{ id: number; content: ArticleSearch }>;
  article: PostExtended;
}
const props = defineProps<Props>();

const showComments = ref(false);
if (process.client) {
  showComments.value = true;
}
const sharingUrl = (useConfigStore().isBetaVersion) ? `https://beta.scripta.network${useRoute().fullPath}` : `https://scripta.network${useRoute().fullPath}`;
const sharingUrlEncoded = encodeURIComponent(sharingUrl);

useHead({
  title: `${props.article.text} - @${props.article.author.dtag} on Scripta`,
  meta: [
    {
      hid: "title",
      name: "title",
      content: props.article.text
    },
    {
      hid: "description",
      name: "description",
      content: props.article.subtitle
    },
    {
      hid: "image",
      name: "image",
      content: searchFirstContentImage(props.article.content)
    },
    {
      hid: "og:title",
      property: "og:title",
      content: props.article.text
    },
    {
      hid: "og:description",
      property: "og:description",
      content: props.article.subtitle
    },
    {
      hid: "og:image",
      property: "og:image",
      content: searchFirstContentImage(props.article.content)
    },
    {
      hid: "og:url",
      property: "og:url",
      content: sharingUrl
    },
    {
      hid: "twitter:title",
      name: "twitter:title",
      content: props.article.text
    },
    {
      hid: "twitter:description",
      name: "twitter:description",
      content: props.article.subtitle
    },
    {
      hid: "twitter:image",
      name: "twitter:image",
      content: searchFirstContentImage(props.article.content)
    },
    {
      hid: "twitter:card",
      name: "twitter:card",
      content: "summary_large_image"
    }
  ]
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

const userReaction = ref(null);
const previousReaction = ref(null);
try {
  await getReactions(props.article.id).then((reaction: ArticleReaction) => { userReaction.value = reaction; previousReaction.value = reaction; });
} catch (e) {
  // no reaction or error
  console.error(e);
}

function handleNavbarChange (event: Event) {
  const { scrollTop } = (event.target as HTMLDivElement);
  if (scrollTop > 120) {
    navBarReading.value.show = true;
  } else {
    navBarReading.value.show = false;
  }
}

async function getReactions (postId: any): Promise<ArticleReaction> {
  const { $useReaction } = useNuxtApp();
  return await $useReaction().getUserPostReaction(postId);
}

function handleReaction (code: string) {
  const { $useReaction } = useNuxtApp();
  const reaction = $useReaction().getReaction(code);
  if (code === userReaction.value?.code) {
    userReaction.value = null;
  } else {
    userReaction.value = reaction;
  }
  console.log(previousReaction.value);
  if (previousReaction.value && userReaction.value === null) {
    $useReaction().removeReaction(props.article.id, previousReaction.value.reactionId);
  } else {
    $useReaction().addReaction(props.article.id, userReaction.value);
  }
}
</script>
