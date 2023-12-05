<template>
  <section>
    <NuxtLayout name="profile" :title="'Wallet'" :to="'/home'">
      <WalletContainer />
    </NuxtLayout>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated"]
});
useHead({
  title: "Scripta - Wallet"
});
</script>
