<template>
  <div>
    <NavBarCard />
    <SearchToolTip v-show="searchShown" />
  </div>
</template>

<script setup lang="ts">
// TODO make it false
const searchShown = ref(false);
provide("search-shown", searchShown);
</script>
