<template>
  <div class="grid grid-cols-2 lg:grid-cols-6 w-full gap-y-4 gap-x-6 lg:gap-x-4 xl:gap-x-10">
    <button
      v-if="!isPublishing"
      type="button"
      class="col-span-1 rounded-xl text-[#FFFFFF] bg-danger text-xl font-medium"
      @click="deleteArticle()"
    >
      Delete Article
    </button>
    <div class="col-span-2 lg:col-start-5">
      <span v-if="!isPublishing">
        <button
          v-if="useDraftStore().title && useDraftStore().subtitle && useDraftStore().content"
          type="button"
          class="w-full h-full rounded-xl text-[#FFFFFF] bg-primary text-xl font-medium"
          @click="editArticle()"
        >
          Publish Edit
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
import { Buffer } from "buffer";
import { MsgDeletePostEncodeObject, MsgEditPostEncodeObject } from "@desmoslabs/desmjs";
import Long from "long";
import { useAccountStore } from "~~/core/store/AccountStore";
import { useDraftStore } from "~~/core/store/DraftStore";
import { useBackendStore } from "~~/core/store/BackendStore";
import { usePostStore } from "~~/core/store/PostStore";
import { useUserStore } from "~~/core/store/UserStore";
import { useDesmosStore } from "~~/core/store/DesmosStore";

const isPublishing = ref(false);

async function editArticle () {
  this.isPublishing = true;
  const { $useIpfs, $useTransaction } = useNuxtApp();
  const draftStore = await useDraftStore();
  const extId = draftStore.externalId;

  const msgEditPost: MsgEditPostEncodeObject = {
    typeUrl: "/desmos.posts.v2.MsgEditPost",
    value: {
      subspaceId: Long.fromNumber(useDesmosStore().subspaceId),
      editor: useAccountStore().address,
      postId: draftStore.id,
      tags: draftStore.tags.map(tag => tag.content.value),
      text: draftStore.title
    }
  };

  // craft a custom object for IPFS
  const ipfsPost: any = {
    ...msgEditPost.value,
    subtitle: draftStore.subtitle,
    content: draftStore.content
  };

  // upload the post to IPFS (without CID attachment), get the returned CID
  const postCid = await $useIpfs().uploadPost(JSON.stringify(ipfsPost));

  const postIpfsUrl = `https://cloudflare-ipfs.com/ipfs/${postCid}`;
  console.log(postIpfsUrl);

  const ipfsEntityUrl = {
    displayUrl: "IPFS",
    start: Long.fromNumber(0),
    end: Long.fromNumber(1),
    url: postIpfsUrl
  };

  // attach the CID to the Post as an entity
  msgEditPost.value.entities = {
    hashtags: [],
    mentions: [],
    urls: [ipfsEntityUrl]
  };

  /* $useTransaction().push(msgCreatePost);
  const signedBytes = await $useTransaction().execute(); */

  let signedBytes = new Uint8Array();
  try {
    signedBytes = await $useTransaction().directSign(msgEditPost);
  } catch (e) {
    console.log(e);
  }

  if (!signedBytes) {
    return;
  }

  const res = await (
    await fetch(`${useBackendStore().apiUrl}/posts/${extId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: draftStore.id,
        signedPost: Buffer.from(signedBytes).toString("base64"),
        externalId: extId,
        author: useAccountStore().address,
        sectionId: useAccountStore().sectionId,
        text: draftStore.title,
        tags: draftStore.tags.map(tag => tag.content.value),
        subtitle: draftStore.subtitle,
        content: draftStore.content,
        entities: JSON.stringify(msgEditPost.value.entities)
      })
    })
  ).json() as any;
  console.log(res);
  if (res.code === 0) {
    usePostStore().userPosts = await useUserStore().getUserArticles(useAccountStore().address);
    draftStore.$reset();
    useRouter().push(`/@${useAccountStore().profile.dtag}/${extId}`);
  }
  isPublishing.value = false;
}

async function deleteArticle () {
  isPublishing.value = true;
  const { $useTransaction } = useNuxtApp();
  const msgDeletePost: MsgDeletePostEncodeObject = {
    typeUrl: "/desmos.posts.v2.MsgDeletePost",
    value: {
      subspaceId: Long.fromNumber(useDesmosStore().subspaceId),
      postId: useDraftStore().id,
      signer: useAccountStore().address
    }
  };

  let signedBytes = new Uint8Array();
  try {
    signedBytes = await $useTransaction().directSign(msgDeletePost);
  } catch (e) {
    console.log(e);
  }

  if (!signedBytes) {
    return;
  }

  const res = await (
    await fetch(`${useBackendStore().apiUrl}/posts/delete/${useDraftStore().externalId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        signedPost: Buffer.from(signedBytes).toString("base64")
      })
    })
  ).json() as any;
  console.log(res);
  if (res.code === 0) {
    usePostStore().userPosts = await useUserStore().getUserArticles(useAccountStore().address);
    useDraftStore().$reset();
    useRouter().push("/profile");
  }
  isPublishing.value = false;
}
</script>
