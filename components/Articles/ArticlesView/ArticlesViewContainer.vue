<template>
  <div class="2xl:flex 2xl:flex-row h-full">
    <ArticlesViewSidebar />
    <div class="bg-background flex flex-col px-4 md:px-32 2xl:px-14 py-5 lg:py-20 gap-y-6 2xl:w-5/6 overflow-y-scroll border-l">
      <div class="flex flex-row gap-x-4 justify-start h-6 py-0.5 items-center">
        <ArticlesViewTag v-for="{i, tag} in tags" :key="i" :content="tag" />
      <!-- <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        class="w-5 h-5 col-end-12"
      >
        <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
      </svg> -->
      </div>
      <ArticlesViewContent />
      <div class="grid grid-cols-2 lg:grid-cols-4 place-content-between lg:gap-x-2 gap-y-3">
        <div class="lg:col-span-1 flex flex-row gap-x-1.5">
          <img src="icons/outline/heart.svg" class="w-5 h-5">
          <!-- Change font to 15px -->
          <p class="font-medium text-sm">
            15k <span class="hidden lg:inline">upvotes</span>
          </p>
        </div>
        <!-- Change font to 15px -->
        <div class="place-self-end lg:place-self-start flex flex-row gap-x-1.5 lg:flex-row-reverse">
          <p class="font-medium text-sm">
            Tip
          </p>
          <img src="icons/bold/send-2.svg" class="w-5 h-5">
        </div>
        <div class="lg:col-end-5 lg:place-self-end flex flex-row gap-x-3">
          <!-- TODO:  change icons -->
          <img src="svg/social/twitter.svg" class="w-5 object-contain">
          <img src="svg/social/facebook.svg" class="w-5 object-contain">
          <img src="svg/social/linkedin.svg" class="w-5 object-contain">
          <img src="svg/social/link.svg" class="w-5 object-contain">
        </div>
      </div>
      <div class="w-full h-11 bg-primary" />
      <div class="flex flex-row ">
        <div class="w-3/5">
          <p>Comments</p>
        </div>
        <div class="flex flex-col w-2/5  2xl:hidden gap-y-2 items-center">
          <p class="text-sm font-bold text-primary-text-light">
            Continue reading
          </p>
          <SearchArticleCard
            v-for="result in articleResults"
            :key="result.id"
            :content="result.content"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// content of the article
import { AuthorSearch, ArticleSearch } from "@/types/SearchResults";

const tags = (new Array(3)).fill(0).map((_, i) => ({ i, tag: `Tag${i + 1}` }));

// content of the author
const contentAuthor: AuthorSearch = { name: "Nickname", image: "/svg/wallet/dpm/logo.svg" };

// content of the article
const title = "Introducing Scripta.network";
const description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce luctus molestie diam et laoreet. Aliquam diam sem, fermentum sed nisl eu, eleifend tincidunt quam. Aliquam diam sem, fermentum sed nisl eu, eleifend tincidunt quam.";
const image = "/img/author_pic.png";
const contentArticle: ArticleSearch = { title, description, image, author: contentAuthor };

const articleResults = ref(
  Array(6)
    .fill(0)
    .map((_, i) => ({ id: i, content: contentArticle }))
);
</script>
