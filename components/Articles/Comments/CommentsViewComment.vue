<script lang="ts" setup>
import { PostComment } from "~~/types/PostComment";

interface Props {
  comment: PostComment;
  isCommentator: boolean;
  isModerator: boolean;
}
const props = defineProps<Props>();

const text = ref(props.comment.text);
const profilePic = ref(props.comment.author.profile_pic || "");
const nickname = ref(props.comment.author.nickname);

const creationDateString = ref(
  getElapsedTime(new Date(props.comment.creation_date))
);
const commentsDateInterval = setInterval(() => {
  creationDateString.value = getElapsedTime(
    new Date(props.comment.creation_date)
  );
}, 1000);

onBeforeUnmount(() => {
  clearInterval(commentsDateInterval);
});

function getElapsedTime (creationDate: Date): string {
  const creationDateDiff =
    (new Date(Date.now()).getTime() -
      1000 * 60 * 60 * 2 -
      creationDate.getTime()) /
    1000;
  const creationDateDiffMinutes = Math.floor(creationDateDiff / 60);
  const creationDateDiffHours = Math.floor(creationDateDiff / 60 / 60);
  return creationDateDiffMinutes < 2 // < 2 minutes
    ? "Just now"
    : creationDateDiffHours < 1 // < 1 hour
      ? `${creationDateDiffMinutes} minutes ago`
      : creationDateDiffHours < 24 // < 24 hours
        ? `${creationDateDiffHours} hours ago`
        : `${creationDate.toLocaleDateString()}`; // > 24 hours
}

const isEditing = ref(false);
// const canWrite = ref(false);

</script>

<template>
  <span v-if="!isEditing">
    <div class="p-3">
      <div class="flex">
        <NuxtLink :to="`/@${props.comment.author?.dtag || props.comment.author}`">
          <img
            :src="profilePic"
            onerror="this.onerror=null;this.src='/img/author_pic.png'"
            class="h-10 w-10 md:h-10 md:w-10 rounded-full object-cover"
          >
        </NuxtLink>
        <div class="w-full ml-3">
          <div class="flex text-sm">
            <div class="flex-1 p-0.5">
              <NuxtLink :to="`/@${props.comment.author?.dtag || props.comment.author}`">
                {{ nickname }}
              </NuxtLink>
              <span class="text-primary-text-light text-xs">
                - {{ creationDateString }}
              </span>
            </div>
            <div class="">
              <ArticlesCommentsActionsOverlay
                :comment="props.comment"
                :is-commentator="props.isCommentator"
                :is-moderator="props.isModerator"
                @edit-comment="isEditing = true"
              />
            </div>
          </div>
          <div
            id=""
            :disabled="true"
            name=""
            class="rounded-xl p-2 pt-4 px-4 bg-background-alt/60 text-primary-text/80"
          >
            {{ text }}
          </div>
        </div>
      </div>
    </div>
  </span>
  <span v-else>
    <ArticlesCommentsEditContainer :comment="props.comment" />
  </span>
</template>
