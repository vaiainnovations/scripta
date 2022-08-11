<template>
  <section>
    <AuthSessionCard />
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated"]
});
</script>
