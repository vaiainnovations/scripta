<template>
  <section>
    <AuthLoadingCard />
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["not-direct-route"]
});
</script>
