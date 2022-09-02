<script lang="ts" setup>
import {
  MsgDeletePostEncodeObject,
  MsgEditPostEncodeObject
} from "@desmoslabs/desmjs";
import Long from "long";
import { PostComment } from "~~/types/PostComment";
import { useAccountStore } from "~~/core/store/AccountStore";
import { useDesmosStore } from "~~/core/store/DesmosStore";

interface Props {
  comment: PostComment;
  isCommentator: boolean;
  isModerator: boolean;
}
const props = defineProps<Props>();
const emit = defineEmits(["editComment"]);

const isOverlayOpen = ref(false);

function toggleOverlay () {
  isOverlayOpen.value = !isOverlayOpen.value;
}

function deleteComment () {
  const { $useTransaction } = useNuxtApp();
  toggleOverlay();

  const msgDeletePost: MsgDeletePostEncodeObject = {
    typeUrl: "/desmos.posts.v2.MsgDeletePost",
    value: {
      subspaceId: Long.fromNumber(useDesmosStore().subspaceId),
      postId: Long.fromNumber(props.comment.id),
      signer: useAccountStore().address
    }
  };
  $useTransaction().push(msgDeletePost);
}

function editComment () {
  const { $useTransaction } = useNuxtApp();
  emit("editComment");
  toggleOverlay();

  const msgEditPost: MsgEditPostEncodeObject = {
    typeUrl: "/desmos.posts.v2.MsgEditPost",
    value: {
      subspaceId: Long.fromNumber(useDesmosStore().subspaceId),
      postId: Long.fromNumber(props.comment.id),
      tags: [],
      text: "edited force",
      editor: useAccountStore().address
    }
  };
  $useTransaction().push(msgEditPost);
}

function report () {
  toggleOverlay();
}
</script>

<template>
  <div>
    <!-- <img
      class="flex items-center justify-center cursor-pointer"
      src="/icons/linear/dots.svg"
      @click="toggleOverlay()"
    >
    <div v-if="isOverlayOpen" class="bg-background-alt/10 p-2 px-1 rounded-2xl absolute w-full h-full top-0 left-0">
      <div v-if="props.isCommentator || props.isModerator" class="bg-background px-3 py-0.5 rounded-md m-1 text-primary-text/60">
        <button @click="deleteArticle">
          Delete
        </button>
      </div>
      <div v-if="props.isCommentator" class="bg-background px-3 py-0.5 rounded-md m-1 text-primary-text/60">
        <button @click="editComment">
          Edit
        </button>
      </div>
      <div>
        <button class="bg-background px-3 py-0.5 rounded-md m-1 text-primary-text/60" @click="editComment">
          Report
        </button>
      </div>
    </div> -->
    <div class="relative inline-block text-left">
      <div>
        <button class="bg-white" @click="toggleOverlay">
          <img src="/icons/linear/dots.svg">
        </button>
      </div>
      <div v-if="isOverlayOpen" class="origin-top-right absolute right-0 mt-1 rounded-2xl shadow-lg bg-background-alt dark:bg-gray-800 ring-opacity-5 z-10">
        <div class="py-1" role="menu" aria-orientation="vertical">
          <!-- Report -->
          <div class="block rounded-lg bg-background/50 hover:bg-background mx-2 my-1.5 py-2 px-2 text-md text-primary-text/60 hover:text-primary-text cursor-pointer select-none" role="menuitem" @click="report()">
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
    </div>
  </div>
</template>
