<template>
  <div class="grid grid-cols-2 lg:grid-cols-6 w-full gap-y-4 gap-x-6 lg:gap-x-4 xl:gap-x-10">
    <button
      v-if="!isPublishing && (useDraftStore().title || useDraftStore().subtitle || useDraftStore().content || useDraftStore().tags.length>0)"
      :disabled="isSavingDraft"
      type="button"
      class="p-1 col-span-1 rounded-xl text-[#FFFFFF] bg-primary-text text-xl font-medium hover:bg-primary-text/50"
      @click="saveDraft()"
    >
      <span v-if="!isSavingDraft">
        Save Draft
      </span>
      <span v-else>
        Saving...
      </span>
    </button>
    <button
      v-if="!isPublishing && (useDraftStore().title || useDraftStore().subtitle || useDraftStore().content || useDraftStore().tags.length>0)"
      type="button"
      class="p-1 col-span-1 rounded-xl text-[#FFFFFF] bg-danger text-xl font-medium"
      @click="deleteDraft()"
    >
      Delete Draft
    </button>
    <div class="col-span-2 lg:col-start-5">
      <span v-if="!isPublishing">
        <button
          v-if="useDraftStore().title && useDraftStore().subtitle && useDraftStore().content"
          type="button"
          class="p-1 w-full h-full rounded-xl text-[#FFFFFF] bg-primary text-xl font-medium"
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
/* import { Buffer } from "buffer"; */
import { MsgCreatePostEncodeObject, MsgSaveProfileEncodeObject } from "@desmoslabs/desmjs";
import Long from "long";
import { v4 as uuidv4 } from "uuid";
import { EncodeObject } from "@cosmjs/proto-signing";
import { useAccountStore } from "~~/core/store/AccountStore";
import { useDraftStore } from "~~/core/store/DraftStore";
/* import { useBackendStore } from "~~/core/store/BackendStore";
import { usePostStore } from "~~/core/store/PostStore";
import { useUserStore } from "~~/core/store/UserStore"; */
import { useDesmosStore } from "~~/core/store/DesmosStore";

const isPublishing = ref(false);
const isSavingDraft = ref(false);

// Auto save draft (if there is some content) every 30s
const saveDraftInterval = setInterval(() => {
  if (!useDraftStore().id && (useDraftStore().title || useDraftStore().subtitle || useDraftStore().content || useDraftStore().tags.length > 0)) {
    saveDraft();
  }
}, 30 * 1000);

onBeforeUnmount(() => {
  saveDraft();
  clearInterval(saveDraftInterval);
});

async function deleteDraft () {
  if (useDraftStore().externalId) {
    await useDraftStore().deleteDraft();
  }
  useRouter().push("/profile");
}

function saveDraft () {
  isSavingDraft.value = true;
  useDraftStore().saveDraft().then(() => {
    isSavingDraft.value = false;
  });
}

async function publish () {
  const { $useTransaction, $useIpfs } = useNuxtApp();
  isPublishing.value = true;

  // check if the user has a sectionId
  if (useAccountStore().sectionId <= 0) {
    // if not, create one
    if (useAccountStore().sectionId === -10) {
      await useAccountStore().getUserSection(true);
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
    isPublishing.value = false;
    throw new Error("Could not get section id");
  }

  const draftStore = useDraftStore();
  const extId = uuidv4();

  const msgCreatePost: MsgCreatePostEncodeObject = {
    typeUrl: "/desmos.posts.v2.MsgCreatePost",
    value: {
      subspaceId: Long.fromNumber(useDesmosStore().subspaceId),
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
    subtitle: draftStore.subtitle,
    content: draftStore.content
  };

  // upload the post to IPFS (without CID attachment), get the returned CID
  const postCid = await $useIpfs().uploadPost(JSON.stringify(ipfsPost));

  const postIpfsUrl = `${$useIpfs().gateway}${postCid}`;
  console.log(postIpfsUrl);

  const ipfsEntityUrl = {
    displayUrl: "IPFS",
    start: Long.fromNumber(0),
    end: Long.fromNumber(1),
    url: postIpfsUrl
  };

  // attach the CID to the Post as an entity
  msgCreatePost.value.entities = {
    hashtags: [],
    mentions: [],
    urls: [ipfsEntityUrl]
  };

  /* $useTransaction().push(msgCreatePost);
  const signedBytes = await $useTransaction().execute(); */

  const msgs = [] as EncodeObject[];

  // if is a new user and has no profile, create one with the randomly generated username
  if (useAccountStore().isNewProfile) {
    const msgSaveProfile: MsgSaveProfileEncodeObject = {
      typeUrl: "/desmos.profiles.v3.MsgSaveProfile",
      value: {
        dtag: useAccountStore().profile.dtag,
        nickname: useAccountStore().profile.nickname,
        bio: useAccountStore().profile.bio,
        profilePicture: useAccountStore().profile.pictures.profile,
        coverPicture: useAccountStore().profile.pictures.cover,
        creator: useAccountStore().address
      }
    };
    msgs.push(msgSaveProfile);
  }
  // push the post message
  console.log(msgCreatePost);
  $useTransaction().push(msgCreatePost);

  /* let signedBytes = new Uint8Array();
  try {
    if (!useAccountStore().authz.hasAuthz) {
      signedBytes = await $useTransaction().directSign(msgs);
    }
  } catch (e) {
    console.log(e);
  }

  if (!signedBytes) {
    return;
  }

  const res = await (await useBackendStore().fetch(
    `${useBackendStore().apiUrl}/posts/${extId}`,
    "POST",
    {
      "Content-Type": "application/json"
    },
    JSON.stringify({
      signedPost: (signedBytes) ? Buffer.from(signedBytes).toString("base64") : "",
      externalId: msgCreatePost.value.externalId,
      author: msgCreatePost.value.author,
      sectionId: msgCreatePost.value.sectionId,
      text: msgCreatePost.value.text,
      tags: msgCreatePost.value.tags,
      subtitle: useDraftStore().subtitle,
      content: useDraftStore().content,
      entities: JSON.stringify(msgCreatePost.value.entities)
    })
  )
  ).json() as any;
  if (res.code === 0) {
    usePostStore().userPosts = await useUserStore().getUserArticles(useAccountStore().address);
    draftStore.$reset();
    useRouter().push(`/@${useAccountStore().profile.dtag}/${extId}`);
  } */
  isPublishing.value = false;
}
</script>
