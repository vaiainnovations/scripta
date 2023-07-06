<template>
  <section>
    <NuxtLayout name="profile">
      <ProfileArticles />
    </NuxtLayout>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated"]
});
useHead({
  title: "Scripta"
});
</script>
