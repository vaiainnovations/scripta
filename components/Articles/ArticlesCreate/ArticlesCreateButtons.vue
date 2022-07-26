<template>
  <div class="grid grid-cols-2 lg:grid-cols-6 w-full gap-y-4 gap-x-6 lg:gap-x-4 xl:gap-x-10">
    <button
      v-if="!isPublishing"
      type="button"
      class="p-1 col-span-1 rounded-xl text-[#FFFFFF] bg-primary-text text-xl font-medium"
    >
      Save Draft
    </button>
    <button
      v-if="!isPublishing"
      type="button"
      class="col-span-1 rounded-xl text-[#FFFFFF] bg-danger text-xl font-medium"
    >
      Delete
    </button>
    <div class="col-span-2 lg:col-start-5">
      <span v-if="!isPublishing">
        <button
          v-if="useDraftStore().title && useDraftStore().subtitle && useDraftStore().content"
          type="button"
          class="w-full h-full rounded-xl text-[#FFFFFF] bg-primary text-xl font-medium"
          @click="publish()"
        >
          Publish
        </button>
      </span>
      <span v-else>
        <img
          src="/svg/spinner/dots.svg"
          class="mx-auto h-4 object-contain fill-white"
        >
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MsgCreatePostEncodeObject } from "@desmoslabs/desmjs";
import Long from "long";
import { v4 as uuidv4 } from "uuid";
import { Media } from "@desmoslabs/desmjs-types/desmos/posts/v2/models";
import { useAccountStore } from "~~/core/store/AccountStore";
import { useDraftStore } from "~~/core/store/DraftStore";

const isPublishing = ref(false);

async function publish () {
  const { $useTransaction, $useIpfs } = useNuxtApp();
  isPublishing.value = true;

  // check if the user has a sectionId
  if (useAccountStore().sectionId <= 0) {
    // if not, create one
    if (useAccountStore().sectionId === -10) {
      await useAccountStore().getUserInfo(true);
      // TODO: handle failure?
    }
    let attempt = 0;
    // wait 10 attempts to create a sectionId, create the group, and user join it
    while (attempt < 10 && useAccountStore().sectionId <= 0) {
      // update the sectionId from the user endpoint
      await useAccountStore().getUserSection();

      // if found, break the loop
      if (useAccountStore().sectionId > 0) {
        break;
      }
      // otherwise, wait 5s and try again
      await new Promise(resolve => setTimeout(resolve, 5000));
      attempt++;
    }
  }
  if (useAccountStore().sectionId <= 0) {
    this.isPublishing.value = false;
    throw new Error("Could not get section id");
  }

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
      sectionId: useAccountStore().sectionId,
      tags: useDraftStore().tags.map(tag => tag.content.value),
      conversationId: Long.fromNumber(0),
      referencedPosts: [],
      replySettings: 1
    }
  };

  // craft a custom object for IPFS
  const ipfsPost: any = {
    ...msgCreatePost.value,
    text: {
      title: draftStore.title,
      subtitle: draftStore.subtitle,
      content: draftStore.content
    }
  };

  // upload the post to IPFS (without CID attachment), get the returned CID
  const postCid = await $useIpfs().uploadPost(JSON.stringify(ipfsPost));

  const postIpfsUrl = `https://cloudflare-ipfs.com/ipfs/${postCid}`;
  console.log(postIpfsUrl);

  // attach the CID to the Post
  msgCreatePost.value.attachments = [
    {
      typeUrl: "/desmos.posts.v2.Media",
      value: Media.encode({
        mimeType: "text/json",
        uri: postIpfsUrl
      }).finish()
    }
  ];

  $useTransaction().push(msgCreatePost);
  const signedBytes = await $useTransaction().execute();

  /* const res = await (
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
  isPublishing.value = false;
}
</script>
