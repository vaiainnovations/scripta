<template>
  <AuthContentCard>
    <AuthDescription>
      <p class="text-2xl font-extrabold">
        Browser Wallet
      </p>
      <p class="text-lg">
        With Leap you can access Web3 apps from the Mobile App or Chrome.
      </p>
    </AuthDescription>
    <AuthStatusCard>
      <img src="/svg/wallet/leap/logo.svg" class="h-32 object-fill">
      <AuthStatusButton class="bg-[#AC4BFF]" @click="onDownloadAction">
        Download
      </AuthStatusButton>
    </AuthStatusCard>
  </AuthContentCard>
</template>

<script setup lang="ts">
import { useLeapStore } from "~~/core/store/wallet/LeapStore";

if (process.client) {
  initLeap();
  window.setInterval(async () => {
    if (!useLeapStore().isInstalled) {
      await initLeap();
    }
  }, 1000);
}

/**
 * Start Leap detection
 * @returns {boolean} true if Leap is installed & initialized
 */
async function initLeap () {
  await useLeapStore().init();
  return useLeapStore().isAvailable;
}

function onDownloadAction () {
  window.open("https://www.leapwallet.io/download");
}
</script>
