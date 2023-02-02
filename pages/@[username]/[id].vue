<template>
  <section>
    <NuxtLayout name="reading-custom">
      <ArticlesViewContainer v-if="!isLoading&&post" :post="post" />
      <span v-else>
        <SkeletonArticlePage />
      </span>
    </NuxtLayout>
  </section>
</template>

<script setup lang="ts">
import { useLogStore } from "~~/core/store/LogStore";
import { usePostStore } from "~~/core/store/PostStore";
import { PostExtended } from "~~/types/PostExtended";
const route = useRoute();
const externalId = route.params.id as string;

const isLoading = useState("isLoading", () => true);
const post = useState("post", () => null as PostExtended | null); // create shared client/server state for the post
const isServerFetched = useState("isPostServerFetched", () => false); // shared state to know if the post has been fetched on the server cache

// If the externalId has changed, reset the post
if (post.value && post.value.externalId !== externalId) {
  post.value = null;
}

// If SSR, fetch the post from KV with backend fallback
if (!post.value && process.server && useDevice().isCrawler) {
  post.value = await usePostStore().getPost(externalId);
  isLoading.value = false;
}

// Fetch only if the post is not already in the store or fetched by the server
if (!post.value && process.client) {
  usePostStore().getPost(externalId).then((p) => {
    post.value = p;
    isLoading.value = false;
  });
}
// Fetch the post
if (process.server) {
  // if server, is fetched from KV
  if (post.value) {
    isServerFetched.value = true;
  }
} else if (!post.value) {
  // if the post hasn't been fetched by the server, or the externalId has changed
  isServerFetched.value = false;
}

if (isServerFetched.value) {
  useLogStore().logOp({ scriptaOp: "getPost", externalId });
}

if (!post) {
  throw createError({
    statusCode: 404,
    message: "Article Not Found",
    data: "You might have the wrong address, or the article may have been deleted."
  });
} else if (post.value) {
  useHead({
    title: `${post.value.text} - @${post.value.author.dtag} on Scripta`,
    meta: [
      {
        hid: "title",
        name: "title",
        content: post.value.text
      },
      {
        hid: "description",
        name: "description",
        content: post.value.subtitle
      },
      {
        hid: "image",
        name: "image",
        content: usePostStore().getArticlePreviewImage(post.value)
      },
      {
        hid: "og:title",
        property: "og:title",
        content: post.value.text
      },
      {
        hid: "og:description",
        property: "og:description",
        content: post.value.subtitle
      },
      {
        hid: "og:image",
        property: "og:image",
        content: usePostStore().getArticlePreviewImage(post.value)
      },
      {
        hid: "og:url",
        property: "og:url",
        content: `https://scripta.network${useRoute().fullPath}`
      },
      {
        hid: "twitter:title",
        name: "twitter:title",
        content: post.value.text
      },
      {
        hid: "twitter:description",
        name: "twitter:description",
        content: post.value.subtitle
      },
      {
        hid: "twitter:image",
        name: "twitter:image",
        content: usePostStore().getArticlePreviewImage(post.value)
      },
      {
        hid: "twitter:card",
        name: "twitter:card",
        content: "summary_large_image"
      }
    ]
  });
}
</script>
