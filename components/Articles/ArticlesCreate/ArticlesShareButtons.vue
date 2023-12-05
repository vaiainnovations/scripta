<template>
  <div class="flex flex-col items-center w-full gap-y-2">
    <div class="flex flex-row gap-x-3 place-self-end">
      <NuxtLayout name="tooltip" :title="'Copy Share Link'" :position="'Bottom'">
        <div @click="copyArticleLink()">
          <img src="/icons/linear/link-2.svg" class="w-5 h-5 object-contain cursor-pointer">
        </div>
      </NuxtLayout>
      <NuxtLayout name="tooltip" :title="'Open Article'" :position="'Bottom'">
        <NuxtLink :to="sharingUrl">
          <img src="/icons/linear/export.svg" class="w-5 h-5 object-contain cursor-pointer">
        </NuxtLink>
      </NuxtLayout>
      <NuxtLayout name="tooltip" :title="'Share on X'" :position="'Bottom'">
        <div @click="shareArticle(`https://twitter.com/intent/tweet?text=${title}&url=${sharingUrl}`)">
          <img src="/brands/x/logo.svg" class="w-5 h-5 object-contain cursor-pointer">
        </div>
      </NuxtLayout>
      <NuxtLayout name="tooltip" :title="'Share on Facebook'" :position="'Bottom'">
        <div @click="shareArticle(`https://www.facebook.com/sharer/sharer.php?u=#${sharingUrl}`)">
          <img src="/brands/facebook/logo.svg" class="w-5 h-5 object-contain cursor-pointer">
        </div>
      </NuxtLayout>
      <NuxtLayout name="tooltip" :title="'Share on Linkedin'" :position="'Bottom'">
        <div @click="shareArticle(`https://www.linkedin.com/sharing/share-offsite/?url=${sharingUrlEncoded}`)">
          <img src="/brands/linkedin/logo.svg" class="w-5 h-5 object-contain cursor-pointer">
        </div>
      </NuxtLayout>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAccountStore } from "~~/core/store/AccountStore";
import { useDraftStore } from "~~/core/store/DraftStore";

const title = useDraftStore().title;
const subtitle = useDraftStore().subtitle;

const sharingUrl = `${window.location.origin}/@${useAccountStore().profile?.dtag}/${useDraftStore().externalId}`;
const sharingUrlEncoded = encodeURIComponent(sharingUrl);

function shareArticle (fallbackUrl: string) {
  useNuxtApp().$useShare().share(`${useRoute().fullPath}`, fallbackUrl, `${title}`, `${subtitle}`);
}
function copyArticleLink () {
  useNuxtApp().$useShare().copy(sharingUrl);
}
</script>
