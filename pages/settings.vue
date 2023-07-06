<template>
  <section>
    <NuxtLayout name="profile" :title="'Settings'" :to="'/home'">
      <SettingsContainer />
    </NuxtLayout>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated"]
});
useHead({
  title: "Scripta - Settings"
});
</script>
