<template>
  <section>
    <NuxtLayout name="reading-custom">
      <ProfileContainer />
    </NuxtLayout>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated"]
});
</script>
