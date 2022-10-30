<script lang="ts" setup>
import {
  MsgDeletePostEncodeObject
} from "@desmoslabs/desmjs";
import Long from "long";
import { PostComment } from "~~/types/PostComment";
import { useAccountStore } from "~~/core/store/AccountStore";

interface Props {
  comment: PostComment;
  isCommentator: boolean;
  isModerator: boolean;
}
const props = defineProps<Props>();
const emit = defineEmits(["editComment"]);

const isOverlayOpen = ref(false);
const isReportOverlayOpen = ref(false);

function toggleOverlay () {
  isOverlayOpen.value = !isOverlayOpen.value;
}
function toggleReportOverlay () {
  isReportOverlayOpen.value = !isReportOverlayOpen.value;
}

function deleteComment () {
  const { $useTransaction, $useDesmosNetwork } = useNuxtApp();
  toggleOverlay();

  const msgDeletePost: MsgDeletePostEncodeObject = {
    typeUrl: "/desmos.posts.v2.MsgDeletePost",
    value: {
      subspaceId: Long.fromNumber($useDesmosNetwork().subspaceId),
      postId: Long.fromNumber(props.comment.id),
      signer: useAccountStore().address
    }
  };
  $useTransaction().push(msgDeletePost, {
    id: Long.fromNumber(props.comment.id),
    scriptaOp: "MsgDeletePostComment"
  });
}

function editComment () {
  emit("editComment");
}

function addReport () {
  toggleOverlay();
  toggleReportOverlay();
}
</script>

<template>
  <div>
    <div class="relative inline-block text-left">
      <div>
        <button class="bg-white" @click="toggleOverlay">
          <img src="/icons/linear/dots.svg">
        </button>
      </div>
      <div v-if="isOverlayOpen" class="origin-top-right absolute right-0 mt-1 rounded-2xl shadow-lg bg-background-alt dark:bg-gray-800 ring-opacity-5 z-10">
        <div class="py-1" role="menu" aria-orientation="vertical">
          <!-- Report -->
          <div class="block rounded-lg bg-background/50 hover:bg-background mx-2 my-1.5 py-2 px-2 text-md text-primary-text/60 hover:text-primary-text cursor-pointer select-none" role="menuitem" @click="addReport()">
            <span class="flex w-20">
              <img src="/icons/bold/info-circle.svg" class="w-6">
              <span class="my-auto pl-2">
                Report
              </span>
            </span>
          </div>
          <!-- Edit -->
          <div v-if="props.isCommentator" class="block rounded-lg bg-background/50 hover:bg-background mx-2 my-1.5 py-2 px-2 text-md text-primary-text/60 hover:text-primary-text cursor-pointer select-none" role="menuitem" @click="editComment()">
            <span class="flex w-20">
              <img src="/icons/bold/edit.svg" class="w-6 rounded-full">
              <span class="my-auto pl-2">
                Edit
              </span>
            </span>
          </div>
          <!-- Delete -->
          <div v-if="props.isCommentator || props.isModerator" class="block rounded-lg bg-background/50 hover:bg-background mx-2 my-1.5 py-2 px-2 text-md text-primary-text/60 hover:text-primary-text cursor-pointer select-none" role="menuitem" @click="deleteComment()">
            <span class="flex w-20">
              <img src="/icons/bold/trash.svg" class="w-6">
              <span class="my-auto pl-2">
                Delete
              </span>
            </span>
          </div>
        </div>
      </div>
      <ReportsActionOverlay v-if="isReportOverlayOpen" :post-id="props.comment.id" :content="props.comment.text" :author="props.comment.author" @close-report-overlay="toggleReportOverlay" />
    </div>
  </div>
</template>
