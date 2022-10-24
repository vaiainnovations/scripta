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
import { useAccountStore } from "~~/core/store/AccountStore";
import { useDraftStore } from "~~/core/store/DraftStore";
import { usePostStore } from "~~/core/store/PostStore";

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
  isPublishing.value = true;
  const success = await usePostStore().savePost();
  if (success) {
    await usePostStore().updateUserPosts();
    useDraftStore().$reset();
    useRouter().push(`/@${useAccountStore().profile.dtag}/${useDraftStore().externalId}`);
  }
  isPublishing.value = false;
}
</script>
