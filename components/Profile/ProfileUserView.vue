<template>
  <span>
    <div class="flex flex-col justify-start items-center px-10 gap-y-3.5 h-fit mt-14 lg:mt-2">
      <ProfileUserPic />
      <p class="text-3xl text-center font-bold">
        {{ useAccountStore().profile?.nickname || '' }}
      </p>
      <div class="text-xl text-center flex">
        @{{ useAccountStore().profile?.dtag || '' }}
        <NuxtLayout
          name="tooltip"
          :position="'Top'"
          :title="'Share'"
          class="my-auto ml-2 cursor-pointer"
          @click="shareProfile()"
        >
          <img src="/icons/linear/link-2.svg" class="w-4 h-4">
        </NuxtLayout>
      </div>
      <div class="min-h-10 max-h-40 overflow-hidden">
        <p class="font-light text-xs text-center">
          {{ useAccountStore().profile?.bio || '' }}
        </p>
      </div>
    </div>
  </span>
</template>

<script setup lang="ts">
import { useAccountStore } from "~~/core/store/AccountStore";

function shareProfile () {
  const shareLink = `${window.location.origin}/@${useAccountStore().profile?.dtag}`;
  useNuxtApp().$useShare().share(
    shareLink,
    "",
    `${useAccountStore().profile?.dtag} on Scripta`,
    `Read the articles that @${useAccountStore().profile?.dtag} wrote on Scripta`,
    shareLink
  );
}
</script>
