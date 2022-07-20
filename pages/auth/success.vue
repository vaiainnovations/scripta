<template>
  <section>
    <AuthSuccessCard />
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated"]
});
</script>
