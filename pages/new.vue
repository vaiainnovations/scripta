<template>
  <section>
    <NuxtLayout name="custom">
      <ArticlesCreate />
    </NuxtLayout>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated"]
});
</script>
