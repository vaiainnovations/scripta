<template>
  <div class="flex flex-col pl-6">
    <p class="text-2xl font-bold">
      Wallet
    </p>
    <p class="text-[9px] text-gray">
      {{ useAccountStore()?.address || '' }}
    </p>
    <div class="flex flex-row gap-x-3 py-1">
      <img
        src="/svg/wallet/dpm/logo.svg"
        class="h-5 w-5 object-contain my-auto"
      >
      <p class="text-xl font-medium">
        {{ useAccountStore().balance.toLocaleString() }} {{ coinDenom }}
      </p>
    </div>
    <a
      class="text-xs hover:underline text-gray hover:text-primary-text"
      href="https://frontier.osmosis.zone/?from=ATOM&to=DSM"
      target="_blank"
    >Buy ${{ coinDenom }}</a>
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
