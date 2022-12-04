<template>
  <!-- Search input, wider on larger screen (>= 1024 px) -->
  <div class="relative h-10 w-full mx-2 sm:w-3/5 lg:w-1/3 xl:w-1/5">
    <label class="block h-full">
      <!-- Search icon on the left of the searchbar -->
      <span class="absolute inset-y-0 left-0 flex items-center pl-2">
        <img
          src="/icons/linear/search-normal.svg"
          class="h-5 w-5"
        >
      </span>
      <!-- Input for searching; activates the search tooltip on the blur/focus event -->
      <input
        v-model="inputSearch"
        class="block h-full w-full rounded-xl border border-gray-light bg-white pl-10 align-middle text-sm text-primary-text placeholder:text-primary-text"
        placeholder="Search for articles"
        type="text"
        @keyup="onSearchInput"
      >
    </label>
  </div>
</template>

<script setup lang="ts">
import { useSearchStore } from "~~/core/store/SearchStore";

const inputSearch = ref("");
const searchShown: Ref<boolean> = inject("search-shown");
let lastQuery = "";

const handleSearchDisplay = (property: boolean) => {
  searchShown.value = property;
};

function onSearchInput () {
  const q = inputSearch.value;
  lastQuery = q;
  setTimeout(async () => {
    if (lastQuery === q) {
      if (q.length < 3) {
        handleSearchDisplay(false);
        return;
      }
      handleSearchDisplay(true);
      await useSearchStore().search(q);
    }
  }, 500);
}
</script>
