<template>
  <div class="bg-background min-h-screen w-full flex flex-col items-center justify-start px-4 gap-y-3.5 py-3.5 lg:px-16 lg:py-10 lg:gap-y-2.5">
    <!-- Last edit -->
    <p
      v-if="useDraftStore().lastSave"
      class="text-primary-text-light text-sm text-left w-full"
    >
      {{ useDraftStore().lastSave.toLocaleString() }}
    </p>
    <!-- Tags -->
    <ArticlesCreateTags class="pt-6" />
    <!-- Input form -->
    <!-- TODO: implement loading skeleton -->
    <ArticlesCreateInput />
    <!-- Submit buttons -->
    <ArticlesCreateButtons
      :draft="true"
      class="mt-6"
    />
  </div>
</template>

<script setup lang="ts">
import { useDraftStore } from "~~/core/store/DraftStore";
const isDraftLoaded = ref(false);

if (process.client) {
  await useDraftStore().loadDraft();
  isDraftLoaded.value = true;
}
</script>
