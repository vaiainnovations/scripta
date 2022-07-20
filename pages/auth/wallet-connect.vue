<template>
  <section>
    <AuthWalletConnectCard />
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["not-authenticated"]
});
</script>
