<template>
  <div v-if="useConfigStore().isBetaVersion">
    <NavBarCard />
    <SearchToolTip v-show="searchShown" />
  </div>
</template>

<script setup lang="ts">
import { useConfigStore } from "~~/core/store/ConfigStore";
const searchShown = ref(false);
provide("search-shown", searchShown);
</script>
