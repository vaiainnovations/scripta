<template>
  <AuthContentCard>
    <AuthDescription>
      <p class="text-2xl font-extrabold">
        Browser Wallet
      </p>
      <p class="text-lg">
        With Keplr you can access Web3 apps from Chrome.
      </p>
    </AuthDescription>
    <AuthStatusCard>
      <img src="/svg/wallet/keplr/logo.svg" class="h-32 object-fill">
      <AuthStatusButton class="bg-[#8C53B2]" @click="onDownloadAction">
        Download
      </AuthStatusButton>
    </AuthStatusCard>
  </AuthContentCard>
</template>

<script setup lang="ts">
import { useKeplrStore } from "~~/core/store/wallet/KeplrStore";

if (process.client) {
  initKeplr();
  window.setInterval(async () => {
    if (!useKeplrStore().isInstalled) {
      await initKeplr();
    }
  }, 1000);
}

/**
 * Start Keplr detection
 * @returns {boolean} true if Keplr is installed & initialized
 */
async function initKeplr () {
  await useKeplrStore().init();
  return useKeplrStore().isAvailable;
}

function onDownloadAction () {
  window.open("https://www.keplr.app/");
}
</script>
