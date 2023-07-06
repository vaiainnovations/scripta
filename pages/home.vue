<template>
  <section>
    <NuxtLayout name="profile">
      <!-- <ProfileUserEdit /> -->
      <ProfileHome />
    </NuxtLayout>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated"]
});

useHead({
  title: "Scripta - Home"
});
</script>
