<script setup lang="ts">
const title = "Hello Scripta";
useHead({
  title
});
</script>

<template>
  <section>
    <NuxtLayout name="custom">
      <!-- <div>
        {{ title }}
      </div> -->
      <TrendingContents>Trending Articles</TrendingContents>
      <TrendingContents :is-author="true">
        Trending Authors
      </TrendingContents>
    </NuxtLayout>
  </section>
</template>
