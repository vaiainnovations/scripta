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

// const canWrite = ref(false);

</script>

<template>
  <div class="p-3">
    <div class="flex">
      <img
        :src="profilePic"
        class="h-7 w-7 md:h-10 md:w-10 rounded-full mr-1 lg:mr-3 mt-2"
      >
      <div class="w-full">
        <div class="flex text-sm">
          <div class="flex-1 p-0.5">
            {{ nickname }}
            <span class="text-primary-text-light text-xs">
              - {{ creationDateString }}
            </span>
          </div>
          <div class="">
            <ArticlesCommentsActionsOverlay
              :comment="props.comment"
              :is-commentator="props.isCommentator"
              :is-moderator="props.isModerator"
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
</template>
