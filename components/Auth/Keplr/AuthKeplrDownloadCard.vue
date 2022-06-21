<template>
  <AuthContentCard>
    <AuthDescription>
      <p class="text-2xl font-extrabold">
        Browser Wallet
      </p>
      <p class="text-lg">
        With Keplr you can access Web3 apps from Chrome Browser desktop.
      </p>
    </AuthDescription>
    <AuthStatusCard>
      <img src="/svg/wallet/keplr/logo.svg" class="object-fill h-32">
      <AuthStatusButton class="bg-[#8C53B2]" @click="onDownloadAction">
        Download
      </AuthStatusButton>
    </AuthStatusCard>
  </AuthContentCard>
</template>

<script setup lang="ts">
function onDownloadAction () {
  window.open("https://www.keplr.app/");
}
</script>
