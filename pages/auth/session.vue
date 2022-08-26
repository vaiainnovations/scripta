<template>
  <section>
    <AuthSessionCard />
  </section>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ["not-direct-route"]
});
</script>
