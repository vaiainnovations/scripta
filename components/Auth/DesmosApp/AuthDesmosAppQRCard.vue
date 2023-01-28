<template>
  <AuthContentCard>
    <AuthDescription>
      <p class="text-2xl font-extrabold">
        Open and Scan.
      </p>
      <div>
        <p class="text-lg">
          Open your Desmos mobile App, and scan the QR code.
        </p>
        <p class="text-sm text-gray">
          Always make sure to scan QR codes from
          <b><a class="text-green">https://</a>scripta.network</b>
        </p>
      </div>
    </AuthDescription>
    <AuthStatusCard>
      <img src="/svg/wallet/dpm/logo.svg" class="object-fill h-32">
      <AuthStatusButton class="bg-orange-light" @click="connect()">
        Connect
      </AuthStatusButton>
    </AuthStatusCard>
  </AuthContentCard>
</template>

<script setup lang="ts">
async function connect () {
  const { $useWalletConnect } = useNuxtApp();
  await $useWalletConnect().connect();
}
</script>
