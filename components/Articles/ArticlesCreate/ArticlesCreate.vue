<template>
  <div class="bg-background w-full flex flex-col items-center justify-start px-4 gap-y-3.5 py-3.5 lg:px-32 lg:py-20 lg:gap-y-2.5">
    <div class="grid grid-cols-2 self-start justify-start w-full items-center">
      <ArticlesEditorButtonBackRouting class="col-span-2 lg:col-span-1" />
      <!-- Last edit -->
      <p
        v-if="useDraftStore().lastSave"
        class="text-primary-text-light text-sm col-span-2 lg:col-span-1 text-right"
      >
        {{ useDraftStore().lastSave.toLocaleString() }}
      </p>
    </div>
    <!-- Tags -->
    <ArticlesCreateTags />
    <!-- Input form -->
    <!-- TODO: implement loading skeleton -->
    <ArticlesCreateInput />
    <!-- Submit buttons -->
    <ArticlesCreateButtons :draft="true" />
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
