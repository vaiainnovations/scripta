<template>
  <div class="flex flex-col pl-6">
    <p class="text-2xl font-bold">
      Wallet
    </p>
    <div class="flex flex-row gap-x-3 pt-1">
      <img
        src="/svg/wallet/dpm/logo.svg"
        class="h-5 w-5 object-contain my-auto"
      >
      <p class="text-xl font-medium">
        {{ useAccountStore().balance.toLocaleString() }} {{ coinDenom }}
      </p>
    </div>
    <NuxtLayout name="tooltip" :title="'Copy Address'" :position="'Top'">
      <div v-if="useAccountStore()?.address">
        <p class="text-[0.65rem] text-gray flex cursor-pointer hover:underline break-all mr-2" @click="copyAddress(useAccountStore()?.address || '')">
          <img
            src="/icons/linear/copy.svg"
            class="h-3 w-3 object-contain my-auto mr-1"
          >
          {{ useAccountStore()?.address || '' }}
        </p>
      </div>
    </NuxtLayout>
    <a
      class="text-xs hover:underline text-gray hover:text-primary-text pt-1"
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

/**
 * Copy address to clipboard
 */
function copyAddress (address = "") {
  navigator.clipboard.writeText(address);
  useNuxtApp().$useNotification().push("Address Copied", "", 1, "");
}
</script>
