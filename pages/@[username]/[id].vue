<template>
  <section>
    <NuxtLayout name="reading-custom">
      <ArticlesViewContainer :post="post" />
    </NuxtLayout>
  </section>
</template>

<script setup lang="ts">
import { usePostStore } from "~~/core/store/PostStore";
const route = useRoute();
const externalId = route.params.id as string;
const post = useState("post", () => null);
if (!process.client) {
  post.value = await usePostStore().getPost(externalId);
} else if (!post.value) {
  post.value = await usePostStore().getPost(externalId);
}
if (!post) {
  throw createError({
    statusCode: 404,
    message: "Article Not Found",
    data: "You might have the wrong address, or the article may have been deleted."
  });
}
</script>
