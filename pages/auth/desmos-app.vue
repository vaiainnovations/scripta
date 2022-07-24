<template>
  <ClientOnly>
    <AuthDesmosAppCard />
  </ClientOnly>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["not-authenticated"]
});
</script>
