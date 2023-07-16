<template>
  <section>
    <NuxtLayout name="profile" :title="'Edit Profile'" :to="'/home'">
      <ProfileUserEdit />
    </NuxtLayout>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated"]
});

useHead({
  title: "Scripta - Profile"
});
</script>
