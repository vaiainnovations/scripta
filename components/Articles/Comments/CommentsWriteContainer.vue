<script lang="ts" setup>
import { MsgCreatePostEncodeObject } from "@desmoslabs/desmjs";
import Long from "long";
import { v4 as uuidv4 } from "uuid";
import { useAccountStore } from "~~/core/store/AccountStore";

interface Props {
  referencedPost: Long;
  sectionId: number;
}
const props = defineProps<Props>();
const emit = defineEmits(["newComment"]);

const comment = ref("");
const isCommentPublishing = ref(false);

const canWrite = ref(false);
if (process.client) {
  if (useAccountStore().address) {
    canWrite.value = true;
  }
}

function postComment () {
  const { $useTransaction, $useDesmosNetwork } = useNuxtApp();
  const extId = uuidv4();
  const msgCreateComment: MsgCreatePostEncodeObject = {
    typeUrl: "/desmos.posts.v2.MsgCreatePost",
    value: {
      subspaceId: Long.fromNumber($useDesmosNetwork().subspaceId),
      externalId: extId,
      attachments: [],
      author: useAccountStore().address,
      text: comment.value,
      sectionId: props.sectionId,
      tags: [],
      conversationId: props.referencedPost,
      referencedPosts: [{
        type: 1 /* PostReferenceType.POST_REFERENCE_TYPE_REPLY */,
        postId: props.referencedPost,
        position: Long.fromNumber(0)
      }],
      replySettings: 1
    }
  };
  isCommentPublishing.value = true;
  $useTransaction().push(msgCreateComment, {
    subspaceId: Long.fromNumber($useDesmosNetwork().subspaceId),
    externalId: extId,
    attachments: [],
    author: useAccountStore().address,
    text: comment.value,
    sectionId: props.sectionId,
    tags: [],
    conversationId: props.referencedPost,
    referencedPosts: [{
      type: 1 /* PostReferenceType.POST_REFERENCE_TYPE_REPLY */,
      postId: props.referencedPost,
      position: Long.fromNumber(0)
    }],
    replySettings: 1,
    scriptaOp: "MsgCreatePostComment"
  });

  $useTransaction().$subscribe(() => {
    if ($useTransaction().queue.length === 0) {
      // comment published
      comment.value = "";
      isCommentPublishing.value = false;
      emit("newComment");
    }
  });
}
</script>

<template>
  <div class="p-3">
    <div v-if="canWrite">
      <div class="flex">
        <img
          :src="useAccountStore().profile?.pictures?.profile || ''"
          class="h-7 w-7 md:h-10 md:w-10 rounded-full mr-1 lg:mr-3"
        >
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
            @click="postComment"
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
