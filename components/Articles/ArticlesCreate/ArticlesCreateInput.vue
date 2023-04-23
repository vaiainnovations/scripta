<template>
  <div class="w-full flex flex-col items-center pt-3 md:mt-10 xl:mt-6 bg-background-alt p-4 md:p-10 lg:px-14 md:rounded-3xl shadow-sm">
    <!-- Preview Image -->
    <div class="w-full flex flex-col items-center group mb-6">
      <ArticlesCreateInputPreviewImage />
    </div>
    <!-- Title -->
    <div class="w-full flex flex-col items-center group mb-6">
      <label
        for="title"
        class="text-primary-text-light font-bold self-start text-base pl-2 group-focus-within:block hidden pb-1"
      >
        Title
      </label>
      <input
        id="title"
        :value="useDraftStore().title"
        type="text"
        class="group h-20 w-full font-bold text-xl bg-background-alt text-primary-text px-7 lg:text-5xl outline-none focus:border-l-background focus:border-l-2"
        maxlength="75"
        placeholder="Title"
        @input="(evt)=> useDraftStore().title = evt.target.value"
      >
      <!-- If does have a title, show the max length -->
      <div v-if="useDraftStore().title && useDraftStore().title.length > 0" class="text-[0.65rem] text-gray-dark w-full text-right">
        {{ useDraftStore().title.length }} / 75
      </div>
    </div>
    <!-- Subtitle -->
    <div class="w-full flex flex-col items-center group mb-6">
      <label
        for="title"
        class="text-primary-text-light font-bold self-start text-base pl-2 group-focus-within:block hidden pb-1"
      >
        Subtitle
      </label>
      <textarea
        :value="useDraftStore().subtitle"
        maxlength="150"
        type="text"
        class="group h-20 w-full py-2 font-bold text-xl bg-background-alt text-primary-text/50 px-7 lg:text-3xl outline-none focus:border-l-background focus:border-l-2"
        placeholder="Subtitle"
        @input="(evt)=> useDraftStore().subtitle = evt.target.value"
      />
      <!-- If does have a subtitle, show the max length -->
      <div v-if="useDraftStore().subtitle && useDraftStore().subtitle.length > 0" class="text-[0.65rem] text-gray-dark w-full text-right">
        {{ useDraftStore().subtitle.length }} / 150
      </div>
    </div>
    <!-- Content -->
    <div class="w-full flex flex-col items-center group my-3 outline-none">
      <!-- <p class="text-primary-text-light font-medium text-xs self-start lg:text-sm">
        Content
      </p> -->
      <MarkDownEditor
        :read-only="false"
        :content="useDraftStore().content || ''"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDraftStore } from "~~/core/store/DraftStore";
</script>
