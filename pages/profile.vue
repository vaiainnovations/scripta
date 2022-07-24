<template>
  <section>
    <NuxtLayout name="reading-custom">
      <ClientOnly>
        <ProfileContainer />
      </ClientOnly>
    </NuxtLayout>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated"]
});
</script>
