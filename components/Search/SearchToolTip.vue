<template>
  <div class="fixed top-0 w-screen h-screen pt-24 xl:pt-18 px-2 mx-auto bg-primary-text-light/30">
    <div class="relative h-5/6 w-full lg:w-3/4 xl:w-3/5 mx-auto px-4 bg-background rounded-xl overflow-scroll shadow-xl">
      <div class="w-full h-fit flex flex-col md:grid md:grid-cols-7 place-content-center items-start gap-y-3 md:gap-x-6 py-4 px-2 md:px-12">
        <div class="md:col-start-1 md:col-span-4 mx-auto">
          <p class="font-bold text-xl text-center">
            Search Results
          </p>
        </div>

        <div class="flex flex-col gap-y-2 order-last md:order-none md:col-start-1 md:col-span-4">
          <SearchArticleCard
            v-for="result in articleResults"
            :key="result.id"
            :content="result.content"
          />
        </div>

        <div class="w-full grid grid-cols-2 md:flex md:flex-col md:justify-start md:items-center place-content-center gap-y-2 gap-x-5 md:gap-y-2 md:col-start-5 md:col-span-3 md:px-4">
          <p class="hidden md:block font-bold text-base text-center lg:text-lg">
            User results
          </p>
          <SearchAuthorCard
            v-for="result in authorResults"
            :key="result.id"
            :content="result.content"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// TODO add fetch request to db
import { AuthorSearch, ArticleSearch } from "@/types/SearchResults";

// content of the author
const contentAuthor: AuthorSearch = { name: "Nickname", image: "/svg/wallet/dpm/logo.svg" };

// content of the article
const title = "Introducing Scripta.network";
const description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce luctus molestie diam et laoreet. Aliquam diam sem, fermentum sed nisl eu, eleifend tincidunt quam. Aliquam diam sem, fermentum sed nisl eu, eleifend tincidunt quam.";
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
