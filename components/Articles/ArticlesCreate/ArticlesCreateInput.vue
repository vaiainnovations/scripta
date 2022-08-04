<template>
  <div class="w-full flex flex-col gap-y-3 items-center pt-3">
    <!-- Title -->
    <div class="w-full flex flex-col items-center">
      <p class="text-primary-text-light font-medium text-xs self-start lg:text-sm">
        Title
      </p>
      <input
        :value="useDraftStore().title"
        type="text"
        class="rounded-xl h-20 w-full border-primary-text-light border bg-background-alt font-bold text-xl text-primary-text px-7 lg:text-3xl"
        @input="(evt)=> useDraftStore().title = evt.target.value"
      >
    </div>
    <!-- Subtitle -->
    <div class="w-full flex flex-col items-center">
      <p class="text-primary-text-light font-medium text-xs lg:text-sm self-start">
        Subtitle
      </p>
      <textarea
        :value="useDraftStore().subtitle"
        maxlength="160"
        type="text"
        class="rounded-xl h-32 w-full border border-primary-text-light bg-background-alt font-medium text-lg text-primary-text align-middle resize-none px-7 lg:text-2xl py-2"
        @input="(evt)=> useDraftStore().subtitle = evt.target.value"
      />
    </div>
    <!-- Content -->
    <div class="w-full flex flex-col items-center">
      <p class="text-primary-text-light font-medium text-xs self-start lg:text-sm">
        Content
      </p>
      <MarkDownEditor :read-only="false" :content="useDraftStore().content" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDraftStore } from "~~/core/store/DraftStore";
</script>
