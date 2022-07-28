<template>
  <!-- Container for reading an article, with a sidebar on larger screens (>= 1536 px)  -->
  <div v-if="post" class="2xl:flex 2xl:flex-row h-full">
    <ArticlesViewSidebar :suggested-articles="suggestedArticlesResults" />
    <ArticlesViewCard :suggested-articles="suggestedArticlesResults" :article="post" />
  </div>
</template>

<script setup lang="ts">
// content of the article
import { usePostStore } from "~~/core/store/PostStore";
import { AuthorSearch, ArticleSearch } from "~~/types/SearchResults";

interface Props {
  externalId: string;
}

const props = defineProps<Props>();

const post = await usePostStore().getPost(props.externalId);
if (!post) {
  // useRouter().push("/404");
}

// Suggested
const suggestedArticlesResults = ref(getSuggestedArticles());

// content of the author

function getSuggestedArticles () {
  const contentAuthor: AuthorSearch = {
    name: "Nickname",
    image: "/svg/wallet/dpm/logo.svg"
  };

  // content of the article
  const title = "Introducing Scripta.network";
  const description =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce luctus molestie diam et laoreet. Aliquam diam sem, fermentum sed nisl eu, eleifend tincidunt quam. Aliquam diam sem, fermentum sed nisl eu, eleifend tincidunt quam.";
  const image = "/img/author_pic.png";
  const contentArticle: ArticleSearch = {
    title,
    subtitle: "",
    tags: [],
    description,
    image,
    author: contentAuthor,
    creation_date: "",
    attachments: []
  };

  return Array(6)
    .fill(0)
    .map((_, i) => ({ id: i, content: contentArticle }));
}
</script>
