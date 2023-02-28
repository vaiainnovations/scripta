<template>
  <div class="bg-background w-full flex flex-col items-center justify-start px-4 lg:px-0 gap-y-3.5 lg:gap-y-2.5">
    <span v-if="!isPublishing">
      <!-- Input form -->
      <ArticlesCreateInput />
      <!-- Tags -->
      <ArticlesCreateTags class="pt-6" />
      <ArticlesCreateButtons
        :draft="true"
        class="mt-6"
        @is-publishing="isPublishing = $event"
      />
      <!-- Last edit -->
      <p
        v-if="useDraftStore().lastSave"
        class="text-primary-text-light text-xs text-left w-full py-2"
      >
        Last save: {{ useDraftStore().lastSave.toLocaleString() }}
      </p>
    </span>
    <div
      v-else
      class="w-full bg-background-alt rounded-2xl col-span-6 h-64 mt-16 mb-64 flex h-full my-auto"
    >
      <div class="my-auto w-full mx-auto">
        <span v-if="!useNuxtApp().$useTransaction().isSigning">
          <p class="text-3xl xl:text-4xl text-center tracing-wide">
            Writing the Article<br>
          </p>
          <p class="pt-2 text-sm font-normal text-primary-text-light text-center">
            Just a second...
          </p>
          <img
            src="/svg/spinner/dots.svg"
            class="mx-auto h-4 object-contain fill-white my-5"
          >
        </span>
        <span v-else>
          <p class="text-3xl xl:text-4xl text-center tracing-wide">
            Sign the Transaction
          </p>
          <p class="pt-2 text-sm font-normal text-primary-text-light text-center">
            Unlock and Approve the transaction in your Wallet
          </p>
          <img
            src="/svg/spinner/dots.svg"
            class="mx-auto h-4 object-contain fill-white my-5"
          >
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDraftStore } from "~~/core/store/DraftStore";
const isDraftLoaded = ref(false);
const isPublishing = ref(false);

if (process.client) {
  useDraftStore().$reset();
  isDraftLoaded.value = true;
}
</script>
