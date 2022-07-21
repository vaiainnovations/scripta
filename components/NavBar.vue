<template>
  <div>
    <NavBarCard />
    <SearchToolTip v-show="searchShown" />
  </div>
</template>

<script setup lang="ts">
const searchShown = ref(false);
provide("search-shown", searchShown);
</script>
