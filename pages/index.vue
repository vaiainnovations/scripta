<script setup lang="ts">
useHead({
  title: "Scripta"
});
</script>

<template>
  <section>
    <NuxtLayout name="custom">
      <TrendingContents class="py-10">
        Trending Articles
      </TrendingContents>
      <TrendingContents :is-author="true" class="py-10">
        Trending Authors
      </TrendingContents>
    </NuxtLayout>
  </section>
</template>
