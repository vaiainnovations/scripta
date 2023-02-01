<template>
  <NuxtLink to="/wallet">
    <div class="m-2 p-2 rounded-2xl" :class="useRoute().path==='/wallet'?'bg-background':'bg-background-alt hover:bg-background/40'">
      <div class="flex">
        <div class="flex flex-col flex-grow">
          <p class="text-xl font-bold">
            Wallet
          </p>
          <div class="flex flex-row gap-x-3">
            <img
              src="/svg/wallet/dpm/logo.svg"
              class="h-5 w-5 object-contain my-auto"
            >
            <p class="text-lg font-medium">
              {{ useAccountStore().balance.toLocaleString() }} {{ coinDenom }}
            </p>
          </div>
        </div>
        <div class="flex-0 my-auto">
          <img src="/icons/linear/arrow-right2.svg">
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { useAccountStore } from "~~/core/store/AccountStore";
const { $useDesmosNetwork } = useNuxtApp();
const coinDenom = ref("");

if (process.client) {
  coinDenom.value = $useDesmosNetwork().coinDenom.toUpperCase();
}
</script>
