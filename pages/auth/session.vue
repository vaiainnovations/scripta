<template>
  <section>
    <AuthSessionCard />
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["not-authenticated"]
});
</script>
