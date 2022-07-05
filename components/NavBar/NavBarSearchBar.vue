<template>
  <!-- Search input, wider on larger screen (>= 1024 px) -->
  <div class="relative h-10 w-56 lg:w-full">
    <label class="block h-full">
      <!-- Search icon on the left of the searchbar -->
      <span class="absolute inset-y-0 left-0 flex items-center pl-2">
        <img src="/icons/linear/search-normal.svg" class="h-5 w-5">
      </span>
      <!-- Input for searching; activates the search tooltip on the blur/focus event -->
      <input
        v-model="inputSearch"
        class="block h-full w-full rounded-xl border border-primary-text-light bg-background-alt pl-10 align-middle text-sm text-primary-text placeholder:text-primary-text"
        placeholder="Search"
        type="text"
        @blur.stop="() => handleSearchDisplay(false)"
        @focus.stop="() => handleSearchDisplay(true)"
        @change.stop="onInputChange"
      >
    </label>
  </div>
</template>

<script setup lang="ts">
const inputSearch = ref("");
const searchShown: Ref<boolean> = inject("search-shown");

const handleSearchDisplay = (property: boolean) => {
  searchShown.value = property;
};

async function onInputChange () {
  if (inputSearch.value.length > 0) {
    // const { data } =
    await useFetch(() => "", {
      method: "POST",
      body: {
        q: inputSearch.value
      }
    });
  }
}
</script>
