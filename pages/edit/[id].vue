<template>
  <section>
    <NuxtLayout name="profile" :title="'Edit Article'" :to="routingHome">
      <ArticlesEdit />
    </NuxtLayout>
  </section>
</template>

<script setup lang="ts">
import { useConfigStore } from "~/core/store/ConfigStore";
import { useAccountStore } from "~~/core/store/AccountStore";
import { useDraftStore } from "~~/core/store/DraftStore";
import { usePostStore } from "~~/core/store/PostStore";

useHead({
  title: "Scripta - Edit"
});
definePageMeta({
  middleware: ["authenticated"]
});

const route = useRoute();
const externalId = route.params.id as string;
const article = await usePostStore().getPost(externalId);
const routingHome = useConfigStore().features.follow ? "/articles" : "/home";
if (!article) {
  await useRouter().push(routingHome);
}
// prevent to open edit page of other user's article
if (article.id !== null && useAccountStore().address !== article.author.address && useAccountStore().profile?.dtag !== article.author) {
  useRouter().push(routingHome);
}
useDraftStore().$reset();

let tags = [];
if (article.tags) {
  tags = article.tags.map((tag, i) => ({
    id: i,
    content: {
      value: tag
    }
  }));
}

useDraftStore().$state = {
  id: article.id,
  externalId: article.externalId,
  content: article.content,
  lastSave: new Date(article.lastEditedDate) || null,
  title: article.text,
  subtitle: article.subtitle,
  previewImage: usePostStore().getArticlePreviewImage(article) || "",
  tags
};
</script>
