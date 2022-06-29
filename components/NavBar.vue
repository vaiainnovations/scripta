<template>
  <div>
    <NavBarCard @handle-search-display="handleSearchDisplay" />
    <SearchToolTip v-show="searchShown" />
  </div>
</template>

<script setup lang="ts">
const searchShown = ref(false);

const handleSearchDisplay = (property:boolean) => {
  searchShown.value = property;
};
</script>
