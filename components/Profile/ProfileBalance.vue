<template>
  <div class="flex flex-col pl-6 gap-y-2">
    <p class="text-2xl font-bold">
      Wallet
    </p>
    <div class="flex flex-row gap-x-3">
      <img
        src="/svg/wallet/dpm/logo.svg"
        class="h-5 w-5 object-contain my-auto"
      >
      <p class="text-xl font-medium">
        {{ useAccountStore().balance.toLocaleString() }} {{ coinDenom }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAccountStore } from "~~/core/store/AccountStore";
const { $useDesmosNetwork } = useNuxtApp();
const coinDenom = ref("");

if (process.client) {
  coinDenom.value = $useDesmosNetwork().coinDenom.toUpperCase();
}

</script>
