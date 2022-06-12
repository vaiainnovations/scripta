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
      <TrendingContents class="py-10">
        Trending Articles
      </TrendingContents>
      <TrendingContents :is-author="true" class="py-10">
        Trending Authors
      </TrendingContents>
    </NuxtLayout>
  </section>
</template>
