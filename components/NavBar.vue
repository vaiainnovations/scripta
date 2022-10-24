<template>
  <div v-if="useConfigStore().isBetaVersion">
    <NavBarCard />
    <div
      class="relative z-10"
      role="dialog"
      aria-modal="true"
    >
      <div
        v-if="searchShown"
        class="w-screen top-0 left-0 h-screen fixed flex items-start pt-20 z-10 duration-700 transform transition-all ease-in-out "
      >
        <SearchToolTip class="z-20 mx-auto w-full sm:w-4/5 md:w-3/4 xl:w-3/5" />
        <div
          class=" w-screen top-0 left-0 h-screen fixed bg-background-alt/40 flex z-10"
          @click="searchShown = false"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useConfigStore } from "~~/core/store/ConfigStore";
const searchShown = ref(false);
provide("search-shown", searchShown);
</script>
