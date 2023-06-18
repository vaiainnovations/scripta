<template>
  <section>
    <NuxtLayout name="profile" :title="'Following'" :to="'/profile'">
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
