<template>
  <!-- Container to set the position of the tooltip -->
  <div class="fixed top-0 mx-auto h-screen w-screen bg-primary-text-light/30 px-2 pt-24 md:pt-20 z-50">
    <!-- Tooltip box with relative position -->
    <div class="relative mx-auto h-5/6 w-full overflow-scroll rounded-2xl bg-background px-4 shadow-xl lg:w-3/4 xl:w-3/5">
      <!-- Flex container on mobile devices (< 768 px), grid with seven columns for bigger ones  -->
      <div class="flex w-full flex-col place-content-center items-start gap-y-3 py-4 px-2 md:grid md:grid-cols-7 md:gap-x-6 md:px-12">
        <!-- Text on top of the results -->
        <div class="mx-auto md:col-span-4 md:col-start-1">
          <p class="text-center text-xl font-bold">
            Search Results
          </p>
        </div>
        <!-- Articles found by the search; on mobile devices (< 768 px) it's last shown -->
        <div class="order-last flex flex-col gap-y-2 md:order-none md:col-span-4 md:col-start-1">
          <SearchArticleCard v-for="result in articleResults" :key="result.id" :content="result.content" />
        </div>
        <!-- Authors found by the search; on mobile devices (< 768 px) it's a grid with two columns; a flex container for bigger ones -->
        <div
          class="grid w-full grid-cols-2 place-content-center gap-y-2 gap-x-5 md:col-span-3 md:col-start-5 md:flex md:flex-col md:items-center md:justify-start md:gap-y-2 md:px-4"
        >
          <!-- Text shown only on bigger devices (>= 768 px) -->
          <p class="hidden text-center text-base font-bold md:block lg:text-lg">
            User results
          </p>
          <SearchAuthorCard v-for="result in authorResults" :key="result.id" :content="result.content" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AuthorSearch, ArticleSearch } from "@/types/SearchResults";

// content of the author
const contentAuthor: AuthorSearch = { name: "Nickname", image: "/svg/wallet/dpm/logo.svg" };

// content of the article
const title = "Introducing Scripta.network";
const description =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce luctus molestie diam et laoreet. Aliquam diam sem, fermentum sed nisl eu, eleifend tincidunt quam. Aliquam diam sem, fermentum sed nisl eu, eleifend tincidunt quam.";
const image = "/img/author_pic.png";
const contentArticle: ArticleSearch = { title, description, image, author: contentAuthor };

const authorResults = ref(
  Array(6)
    .fill(0)
    .map((_, i) => ({ id: i, content: contentAuthor }))
);

const articleResults = ref(
  Array(6)
    .fill(0)
    .map((_, i) => ({ id: i, content: contentArticle }))
);
</script>
