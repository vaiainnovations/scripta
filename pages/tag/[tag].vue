<template>
  <div>
    <NuxtLayout name="custom">
      <div class="p-4 sm:px-10 md:px-16 lg:mx-20 xl:mx-64">
        <section class="py-8">
          <TrendingTags />
        </section>
        <section class="py-8">
          <div class="flex pb-4">
            <!-- Go back button -->
            <NuxtLink
              class="self-end"
              to="/explore"
            >
              <img
                src="/icons/bold/close-circle.svg"
                alt="Back"
                class="w-7 h-7 mr-2"
              >
            </NuxtLink>
            <h1 class="ml-2 text-3xl font-extrabold">
              <TheTag
                :tag="tag"
                class="my-auto h-full"
              />
            </h1>
          </div>

          <div v-if="(articles.length>0)">
            <div
              v-for="article in articles"
              :key="article.id"
            >
              <ArticlesWidePreview :content="article" />
            </div>
          </div>
        </section>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup>
import { useSearchStore } from "~~/core/store/SearchStore";

const route = useRoute();
const tag = route.params.tag;
const articles = useState("articlesByTag", () => []);

if (process.client) {
  articles.value = await useSearchStore().searchByTags(tag);
}
</script>
