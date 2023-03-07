<template>
  <div class="mr-4 my-1">
    <div class="flex items-center">
      <div class="flex-none h-full align-middle mr-3 ml-2">
        <img src="/icons/linear/pending-circle.svg" class="my-auto h-8 w-8">
      </div>
      <div class="flex-grow">
        <div class="font-medium text-center">
          Connecting wallet
        </div>
        <span class="pt-4 text-sm font-normal text-primary-text-light">
          Open and Unlock your Wallet {{ useNuxtApp().$useWallet().signerId === 'walletconnect' ? 'App' : '' }}
        </span>
        <div class="text-center text-xs">
          {{ $useTransaction().errorText }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $useTransaction } = useNuxtApp();
</script>
