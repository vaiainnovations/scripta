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
        :key="comment.comment.id"
        :comment="comment.comment"
        :is-commentator="comment.comment.author.address === useAccountStore().address"
        :is-moderator="props.sectionId === useAccountStore().sectionId"
        class="gap-2"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAccountStore } from "~~/core/store/AccountStore";
import { useBackendStore } from "~~/core/store/BackendStore";
import { PostComment } from "~~/types/PostComment";

interface Props {
  referencedPost: Long;
  sectionId: number;
}
const props = defineProps<Props>();
const comments = ref([] as { comment: PostComment}[]);

updateArticleComments();

async function updateArticleComments () {
  const { $useDesmosNetwork } = useNuxtApp();
  const query = `query PostReplies {
  comments: post_reference(where: {reference: {subspace_id: {_eq: ${$useDesmosNetwork().subspaceId}}, id: {_eq: ${props.referencedPost.toString()}}}}, order_by:{reference: {creation_date:desc}}) {
    comment: post {
      id
      text
      creation_date
      author {
        address
        dtag
        nickname
        profile_pic
      }
    }
  }
}`;
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
    data: { comments: {comment: PostComment[]}[] };
  };
  if (
    !commentsResponse ||
    !commentsResponse.data ||
    !commentsResponse.data.comments
  ) {
    // TODO: handle error?
  }
  comments.value = commentsResponse.data.comments;
}
</script>
