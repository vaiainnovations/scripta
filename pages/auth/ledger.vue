<template>
  <section>
    <AuthLedgerCard />
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["not-authenticated"]
});
</script>
