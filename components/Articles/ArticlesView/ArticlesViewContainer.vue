<template>
  <!-- Container for reading an article, with a sidebar on larger screens (>= 1536 px)  -->
  <div class="h-full 2xl:flex 2xl:flex-row 2xl:overflow-hidden">
    <ArticlesViewSidebar :suggested-articles="articleResults" />
    <ArticlesViewCard :suggested-articles="articleResults" />
  </div>
</template>

<script setup lang="ts">
// content of the article
import { AuthorSearch, ArticleSearch } from "~~/types/SearchResults";

// content of the author
const contentAuthor: AuthorSearch = { name: "Nickname", image: "/svg/wallet/dpm/logo.svg" };

// content of the article
const title = "Introducing Scripta.network";
const description =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce luctus molestie diam et laoreet. Aliquam diam sem, fermentum sed nisl eu, eleifend tincidunt quam. Aliquam diam sem, fermentum sed nisl eu, eleifend tincidunt quam.";
const image = "/img/author_pic.png";
const contentArticle: ArticleSearch = { title, description, image, author: contentAuthor };

const articleResults = ref(
  Array(6)
    .fill(0)
    .map((_, i) => ({ id: i, content: contentArticle }))
);
</script>
