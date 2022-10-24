<template>
  <section>
    <NuxtLayout name="reading-custom">
      <ArticlesViewContainer :post="post" />
    </NuxtLayout>
  </section>
</template>

<script setup lang="ts">
import { useLogStore } from "~~/core/store/LogStore";
import { usePostStore } from "~~/core/store/PostStore";
const route = useRoute();
const externalId = route.params.id as string;

const post = useState("post", () => null); // create shared client/server state for the post
const isServerFetched = useState("isPostServerFetched", () => false); // shared state to know if the post has been fetched on the server cache

// Fetch the post
if (!process.client) {
  // if server, fetch from KV
  post.value = await usePostStore().getPost(externalId);
  if (post.value) {
    isServerFetched.value = true;
  }
} else if (!post.value || post.value.externalId !== externalId) {
  // if the post hasn't been fetched by the server, or the externalId has changed, fetch from the backend
  post.value = await usePostStore().getPost(externalId);
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
}
</script>
