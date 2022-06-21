<template>
  <AuthContentCard>
    <AuthDescription>
      <p class="text-2xl font-extrabold">
        One App for your decentralized Social Networks.
      </p>
      <p class="text-lg">
        With the Desmos App you can login in any Social Network based on Desmos with just one click from your phone.
      </p>
    </AuthDescription>
    <AuthStatusCard>
      <img src="/svg/wallet/dpm/logo.svg" class="object-fill h-24 md:h-32">
      <AuthStatusButton class="bg-[#FFA756]" @click="onDownloadAction()">
        Download
      </AuthStatusButton>
    </AuthStatusCard>
  </AuthContentCard>
</template>

<script setup lang="ts">
function onDownloadAction () {
  window.open("https://dpm.desmos.network/");
}
</script>
