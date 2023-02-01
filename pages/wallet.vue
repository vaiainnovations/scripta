<template>
  <section>
    <NuxtLayout name="profile" :title="'Wallet'" :to="'/profile'">
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
