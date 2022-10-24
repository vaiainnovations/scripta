<template>
  <section>
    <AuthLoadingCard />
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["not-authenticated", "not-direct-route"]
});
</script>
