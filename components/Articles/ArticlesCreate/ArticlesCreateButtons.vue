<template>
  <div class="grid grid-cols-2 lg:grid-cols-6 w-full gap-y-4 gap-x-6 lg:gap-x-4 xl:gap-x-10">
    <button
      type="button"
      class="p-1 col-span-1 rounded-xl text-[#FFFFFF] bg-primary-text text-xl font-medium"
    >
      Save Draft
    </button>
    <button
      type="button"
      class="col-span-1 rounded-xl text-[#FFFFFF] bg-danger text-xl font-medium"
    >
      Delete
    </button>
    <button
      type="button"
      class="col-span-2 lg:col-start-5 rounded-xl text-[#FFFFFF] bg-primary text-xl font-medium"
      @click="publish()"
    >
      Publish
    </button>
  </div>
</template>

<script setup lang="ts">
import { MsgCreatePostEncodeObject } from "@desmoslabs/desmjs";
import Long from "long";
import { v4 as uuidv4 } from "uuid";
import { Media } from "@desmoslabs/desmjs-types/desmos/posts/v2/models";
import { useAccountStore } from "~~/core/store/AccountStore";
import { useDraftStore } from "~~/core/store/DraftStore";
import { useTransactionStore } from "~~/core/store/TransactionStore";
import { useIpfsStore } from "~~/core/store/IpfsStore";

async function publish () {
  const draftStore = useDraftStore();
  const extId = uuidv4();

  const msgCreatePost: MsgCreatePostEncodeObject = {
    typeUrl: "/desmos.posts.v2.MsgCreatePost",
    value: {
      subspaceId: Long.fromNumber(8),
      externalId: extId,
      attachments: [],
      author: useAccountStore().address,
      text: draftStore.title,
      sectionId: 2,
      tags: [],
      conversationId: Long.fromNumber(0),
      referencedPosts: [],
      replySettings: 1
    }
  };

  // upload the post (without CID attachment) to IPFS, get the CID
  const ipfsPost: any = {
    ...msgCreatePost.value,
    text: {
      title: draftStore.title,
      subtitle: draftStore.subtitle,
      content: draftStore.content
    }
  };
  const postCid = await useIpfsStore().uploadPost(JSON.stringify(ipfsPost));
  const postIpfsUrl = `https://cloudflare-ipfs.com/ipfs/${postCid}`;
  msgCreatePost.value.attachments = [{
    typeUrl: "/desmos.posts.v2.Media",
    value: Media.encode({
      mimeType: "text/plain",
      uri: postIpfsUrl
    }).finish()
  }];
  useTransactionStore().push(msgCreatePost);
  const signedBytes = await useTransactionStore().execute();

  /*  const res = await (
    await fetch("http://192.168.1.108:4000/v1/test3", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        signedPost: Buffer.from(signedBytes).toString("base64"),
        extId: msgCreatePost.value.externalId,
        author: msgCreatePost.value.author,
        sectionId: msgCreatePost.value.sectionId,
        text: msgCreatePost.value.text
      })
    })
  ).json(); */
  console.log(signedBytes);
}
</script>
