<template>
  <section>
    <NuxtLayout name="custom">
      <ArticlesEdit />
    </NuxtLayout>
  </section>
</template>

<script setup lang="ts">
import { useDraftStore } from "~~/core/store/DraftStore";
import { usePostStore } from "~~/core/store/PostStore";

definePageMeta({
  middleware: ["authenticated"]
});

const route = useRoute();
const externalId = route.params.id as string;
const article = await usePostStore().getPost(externalId);
if (!article) {
  useRouter().replace("/profile");
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
  tags
};
</script>
