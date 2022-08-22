<template>
  <section>
    <NuxtLayout name="reading-custom">
      <SettingsContainer />
    </NuxtLayout>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated"]
});
</script>
