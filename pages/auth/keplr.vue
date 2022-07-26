<template>
  <section>
    <AuthKeplrCard />
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["not-authenticated"]
});
</script>
