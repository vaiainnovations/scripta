<template>
  <div>
    <ArticlesCommentsWriteContainer
      class="w-full lg:w-2/3"
      :referenced-post="props.referencedPost"
      :section-id="props.sectionId"
      @new-comment="updateArticleComments()"
    />
    <div class="pt-4 w-full lg:w-2/4">
      <ArticlesCommentsViewComment
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        class="gap-2"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useBackendStore } from "~~/core/store/BackendStore";
import { PostComment } from "~~/types/PostComment";

interface Props {
  referencedPost: Long;
  sectionId: number;
}
const props = defineProps<Props>();
const comments = ref([] as PostComment[]);

updateArticleComments();

async function updateArticleComments () {
  const query = `query getPostComments {
  post(where: {references: {reference_id:{_eq: ${props.referencedPost.toString()} }}}, order_by:{creation_date:desc}){
    id
    text
    creation_date
    author{
      address
      dtag
      nickname
      profile_pic
    }
  }
}
`;
  const commentsResponse = (await (
    await useBackendStore().fetch(
      `${useBackendStore().apiUrl}graphql`,
      "POST",
      {
        "Content-Type": "application/json"
      },
      JSON.stringify({ q: query, type: "" })
    )
  ).json()) as {
    data: { post: PostComment[] };
  };
  if (
    !commentsResponse ||
    !commentsResponse.data ||
    !commentsResponse.data.post
  ) {
    // TODO: handle error?
  }
  comments.value = commentsResponse.data.post;
}
</script>
