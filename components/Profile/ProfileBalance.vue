<template>
  <div class="flex flex-col pl-6 gap-y-2">
    <p class="text-2xl font-bold">
      Wallet
    </p>
    <div class="flex flex-row gap-x-3">
      <img src="/svg/wallet/dpm/logo.svg" class="h-5 w-5 object-contain">
      <p class="text-xl font-medium">
        {{ accountBalance }} DSM
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const accountBalance = 130;
</script>
