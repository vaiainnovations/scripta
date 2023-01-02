<template>
  <div class="bg-background w-full flex flex-col items-center justify-start px-4 lg:px-0 gap-y-3.5 lg:gap-y-2.5">
    <!-- Last edit -->
    <p
      v-if="useDraftStore().lastSave"
      class="text-primary-text-light text-sm text-left w-full"
    >
      {{ useDraftStore().lastSave.toLocaleString() }}
    </p>
    <!-- Input form -->
    <ArticlesCreateInput />
    <!-- Tags -->
    <ArticlesCreateTags class="pt-6" />
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
  useDraftStore().$reset();
  isDraftLoaded.value = true;
}
</script>
