<template>
  <section>
    <NuxtLayout name="profile" :title="'Following'" :to="'/home'">
      <ProfileUserFollowings />
    </NuxtLayout>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated"]
});

useHead({
  title: "Scripta - Following"
});
</script>
