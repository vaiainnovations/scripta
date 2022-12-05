<template>
  <div>
    <NuxtLayout name="reading-custom">
      <div class="p-10 lg:px-32">
        <TrendingTags />
        {{ tag }}
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup>
const route = useRoute();
const tag = route.params.tag;
</script>
