<template>
  <div class="grid grid-cols-2 lg:grid-cols-6 w-full gap-y-4 gap-x-6 lg:gap-x-4 xl:gap-x-10">
    <button
      v-if="!isPublishing && (useDraftStore().title || useDraftStore().subtitle || useDraftStore().content || useDraftStore().tags.length>0) && !useDraftStore().id"
      :disabled="isSavingDraft"
      type="button"
      class="p-1 col-span-1 rounded-lg text-[#FFFFFF] bg-primary-text text-xl font-medium hover:bg-primary-text/50"
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
      v-if="!isPublishing"
      type="button"
      class="p-1 col-span-1 rounded-lg text-[#FFFFFF] bg-danger/70 hover:bg-danger text-xl font-medium"
      @click="deleteArticle()"
    >
      <span v-if="useDraftStore().id">
        Delete Article
      </span>
      <span v-else>
        Delete Draft
      </span>
    </button>
    <div class="col-span-2 lg:col-start-5">
      <span v-if="!isPublishing">
        <button
          v-if="useDraftStore().title && useDraftStore().subtitle && useDraftStore().content"
          type="button"
          class="p-1 w-full h-full rounded-lg text-[#FFFFFF] bg-primary/90 hover:bg-primary text-xl font-medium"
          @click="publish()"
        >
          <span v-if="useDraftStore().id">
            Publish Edit
          </span>
          <span v-else>
            Publish Article
          </span>
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
import {
  MsgDeletePostEncodeObject,
  MsgEditPostEncodeObject
} from "@desmoslabs/desmjs";
import { Url } from "@desmoslabs/desmjs-types/desmos/posts/v3/models";
import Long from "long";
import { useAccountStore } from "~~/core/store/AccountStore";
import { useDraftStore } from "~~/core/store/DraftStore";
import { useBackendStore } from "~~/core/store/BackendStore";
import { usePostStore } from "~~/core/store/PostStore";

const isSavingDraft = ref(false);
const isPublishing = ref(false);

const emit = defineEmits(["isPublishing"]);

let saveDraftInterval = null as NodeJS.Timer | null;

if (!useDraftStore().id) {
  saveDraftInterval = setInterval(() => {
    // ensure that is a draft
    if (!useDraftStore().id && (useDraftStore().title || useDraftStore().subtitle || useDraftStore().content || useDraftStore().tags.length > 0)) {
      saveDraft();
    }
  }, 20 * 1000);
}

onBeforeUnmount(async () => {
  // ensure that is a draft and has an active timer
  if (!useDraftStore().id && saveDraftInterval) {
    await saveDraft();
    clearInterval(saveDraftInterval);
  }
});

function saveDraft () {
  isSavingDraft.value = true;
  useDraftStore().saveDraft().then(() => {
    isSavingDraft.value = false;
  });
}

async function publish () {
  const { $useNotification } = useNuxtApp();
  emit("isPublishing", true);
  isPublishing.value = true;
  if (useDraftStore().id) {
    editArticle();
    return;
  }
  const success = await usePostStore().savePost();
  if (success) {
    try {
      await usePostStore().updateUserPosts();
      useDraftStore().$reset();
      useRouter().push(`/@${useAccountStore().profile.dtag}/${useDraftStore().externalId}`);
    } catch (e) {
      console.log(e);
    }
  } else {
    $useNotification().error("Ops, an error", "An error occurred while writing on chain", 7);
    await useRouter().push("/articles");
  }
  isPublishing.value = false;
  emit("isPublishing", false);
}

async function editArticle () {
  const { $useIpfsUploader, $useTransaction, $useDesmosNetwork, $useNotification } = useNuxtApp();
  const draftStore = await useDraftStore();
  const extId = draftStore.externalId;
  isPublishing.value = true;
  emit("isPublishing", true);
  // filter out empty tags
  const tags = draftStore.tags.filter(tag => tag.content.value !== "" ? tag.content.value : null);

  const msgEditPost: MsgEditPostEncodeObject = {
    typeUrl: "/desmos.posts.v3.MsgEditPost",
    value: {
      subspaceId: Long.fromNumber(Number($useDesmosNetwork().subspaceId)),
      editor: useAccountStore().address,
      postId: Long.fromNumber(Number(draftStore.id)),
      tags: tags.map(tag => tag.content.value),
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
  const postCid = await $useIpfsUploader().uploadPost(JSON.stringify(ipfsPost));

  const postIpfsUrl = `${$useIpfsUploader().gateway}${postCid}`;

  const entityUrls = [] as Url[];

  const ipfsEntityUrl = {
    displayUrl: "IPFS",
    start: Long.fromNumber(0),
    end: Long.fromNumber(1),
    url: postIpfsUrl
  };
  entityUrls.push(ipfsEntityUrl);

  // attach the article preview image
  if (!draftStore.previewImage) {
    draftStore.previewImage = usePostStore().searchFirstContentImage(draftStore.content);
  }

  if (draftStore.previewImage) {
    const ipfsImagePreviewUrl = {
      displayUrl: "preview",
      start: Long.fromNumber(2),
      end: Long.fromNumber(3),
      url: draftStore.previewImage
    };
    entityUrls.push(ipfsImagePreviewUrl);
  }

  // attach the CID to the Post as an entity
  msgEditPost.value.entities = {
    hashtags: [],
    mentions: [],
    urls: entityUrls
  };

  $useTransaction().assertBalance("/articles");
  const success = await $useTransaction().directTx([msgEditPost], [{
    id: draftStore.id,
    externalId: extId,
    author: useAccountStore().address,
    sectionId: useAccountStore().sectionId,
    text: draftStore.title,
    tags: tags.map(tag => tag.content.value),
    subtitle: draftStore.subtitle,
    content: draftStore.content,
    entities: JSON.stringify(msgEditPost.value.entities),
    scriptaOp: "MsgEditPost"
  }]);

  if (success) {
    await usePostStore().updateUserPosts();
    useDraftStore().$reset();
    useRouter().push(`/@${useAccountStore().profile.dtag}/${extId}`);
  } else {
    $useNotification().error("Ops, an error", "An error occurred while writing on chain", 7);
    await useRouter().push("/articles");
  }
  isPublishing.value = false;
  emit("isPublishing", false);
}

async function deleteArticle () {
  isPublishing.value = true;
  emit("isPublishing", true);
  const { $useTransaction, $useDesmosNetwork, $useNotification } = useNuxtApp();

  // if draft, just delete the draft from the backend
  if (!useDraftStore().id) {
    await (
      await useBackendStore().fetch(
        `${useBackendStore().apiUrl}/posts/delete/${useDraftStore().externalId}`,
        "POST",
        {
          "Content-Type": "application/json"
        },
        JSON.stringify({
          draft: true
        })
      )
    ).json();
    isPublishing.value = false;
    emit("isPublishing", false);
    await navigateTo("/articles");
    return;
  }
  $useTransaction().assertBalance("/articles");

  // otherwise, delete the post from the chain & the backend
  const msgDeletePost: MsgDeletePostEncodeObject = {
    typeUrl: "/desmos.posts.v3.MsgDeletePost",
    value: {
      subspaceId: Long.fromNumber(Number($useDesmosNetwork().subspaceId)),
      postId: Long.fromNumber(Number(useDraftStore().id)),
      signer: useAccountStore().address
    }
  };
  const success = await $useTransaction().directTx([msgDeletePost], [{
    id: useDraftStore().id,
    externalId: useDraftStore().externalId,
    scriptaOp: "MsgDeletePost"
  }]);
  if (success) {
    await usePostStore().updateUserPosts();
    await useRouter().push("/articles");
  } else {
    $useNotification().error("Ops, an error", "An error occurred while writing on chain", 7);
    await useRouter().push("/articles");
  }
  isPublishing.value = false;
  emit("isPublishing", false);
}
</script>
