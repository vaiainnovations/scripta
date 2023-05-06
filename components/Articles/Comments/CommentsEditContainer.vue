<script lang="ts" setup>
import { MsgEditPostEncodeObject } from "@desmoslabs/desmjs";
import Long from "long";
import { useAccountStore } from "~~/core/store/AccountStore";
import { PostComment } from "~~/types/PostComment";

interface Props {
  comment: PostComment;
}
const props = defineProps<Props>();
const emit = defineEmits(["editComment"]);

const comment = ref(props.comment.text);
const isCommentPublishing = ref(false);

const canWrite = ref(false);
if (process.client) {
  if (useAccountStore().address) {
    canWrite.value = true;
  }
}

function edit () {
  const { $useTransaction, $useDesmosNetwork } = useNuxtApp();
  const msgEditComment: MsgEditPostEncodeObject = {
    typeUrl: "/desmos.posts.v2.MsgEditPost",
    value: {
      subspaceId: Long.fromNumber($useDesmosNetwork().subspaceId),
      postId: Long.fromNumber(props.comment.id),
      editor: useAccountStore().address,
      text: comment.value,
      tags: []
    }
  };
  isCommentPublishing.value = true;
  $useTransaction().push(msgEditComment, {
    id: Long.fromNumber(props.comment.id),
    text: comment.value,
    scriptaOp: "MsgEditPostComment"
  });

  $useTransaction().$subscribe(() => {
    if ($useTransaction().queue.length === 0) {
      // comment published
      isCommentPublishing.value = false;
      emit("editComment");
    }
  });
}
</script>

<template>
  <div class="p-3">
    <div v-if="canWrite">
      <div class="flex">
        <ImageWrapper
          :img-url="useAccountStore().profile?.pictures?.profile || ''"
          :img-class="'h-7 w-7 md:h-10 md:w-10 rounded-full mr-1 lg:mr-3'"
        />
        <textarea
          id=""
          v-model="comment"
          :disabled="isCommentPublishing"
          name=""
          placeholder="Write a comment..."
          class="w-full rounded-3xl h-36 p-2 px-4 bg-background-alt resize-none border-4 border-background-alt outline-none"
          :class="{ 'bg-primary-text-light/10 border-primary-text-light/5': isCommentPublishing }"
          maxlength="500"
        />
      </div>
      <div
        v-if="comment.length > 0"
        class="relative -mt-[2.7rem] -mr-1 flex flex-1 float-right pr-2"
      >
        <span v-if="!isCommentPublishing">
          <button
            class="hover:bg-primary/30 text-background-alt rounded-full bg-primary/10 p-2 transition duration-150 ease-in-out"
            @click="edit"
          >
            <img
              class=""
              src="/icons/bold/send-2.svg"
              alt=""
            >
          </button>
        </span>
        <span v-else>
          <img src="/svg/spinner/dots.svg" class="p-2 w-12 h-12 mr-2 mb-2">
        </span>
      </div>
    </div>
  </div>
</template>
