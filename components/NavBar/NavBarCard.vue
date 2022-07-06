<template>
  <!-- TODO fix breakpoints -->
  <div class="fixed top-0 h-fit w-screen pt-6 md:pt-0 bg-background-alt md:shadow-lg">
    <div class="h-16 flex flex-row justify-between items-center md:gap-x-24 xl:gap-x-48 px-3 md:px-8 xl:px-16">
      <NuxtLink to="/" class="flex flex-row justify-center items-center gap-x-6">
        <!-- TODO change svg (and fill color) -->
        <svg class="w-10 h-10" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="50" />
        </svg>
        <p class="hidden lg:block font-medium text-2xl">
          Scripta
        </p>
      </NuxtLink>
      <div class="relative h-10 w-56 md:w-full">
        <label class="block h-full">
          <span class="absolute inset-y-0 left-0 flex items-center pl-2">
            <!-- TODO change svg (and fill color) -->
            <svg class="h-5 w-5" viewBox="0 0 20 20">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
            </svg>
          </span>
          <input
            v-model="inputSearch"
            class="block w-full h-full pl-9 bg-background-alt border border-primary-text-light rounded-xl text-sm align-middle placeholder:text-primary-text"
            placeholder="Search"
            type="text"
            @blur.stop="$emit('handleSearchDisplay', false)"
            @focus.stop="$emit('handleSearchDisplay', true)"
            @change.stop="onInputChange"
          >
        </label>
      </div>
      <div class="w-fit">
        <div class="block lg:hidden">
          <img src="icons/linear/profile-circle.svg" class="h-10 w-10">
        </div>
        <div class="hidden lg:block">
          <div class="h-10 w-44 flex flex-row items-center justify-center rounded-lg border border-primary-text-light">
            <!-- TODO change font color (from-to), button type -->
            <NuxtLink to="/auth" type="button" class="text-2xl font-semibold bg-clip-text text-white bg-gradient-to-r from-primary-light to-[#5BFF6C]">
              Write
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const inputSearch = ref("");

async function onInputChange () {
  if (inputSearch.value.length > 0) {
    // const { data } =
    await useFetch(
      () => "https://rest-dev.scripta.network/v1/search",
      {
        method: "POST",
        body: {
          q: inputSearch.value
        }
      });
  }
}

</script>
