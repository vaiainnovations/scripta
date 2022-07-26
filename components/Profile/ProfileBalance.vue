<template>
  <div class="flex flex-col pl-6 gap-y-2">
    <p class="text-2xl font-bold">
      Wallet
    </p>
    <div class="flex flex-row gap-x-3">
      <img src="/svg/wallet/dpm/logo.svg" class="h-5 w-5 object-contain">
      <p class="text-xl font-medium">
        {{ useAccountStore().balance }} DSM
      </p>
    </div>
    <button class="px-1 py-0.5 bg-danger rounded-2xl" @click="logout()">
      Logout
    </button>
  </div>
</template>

<script setup lang="ts">
import { useAccountStore } from "~~/core/store/AccountStore";

function logout () {
  const { $useAuth } = useNuxtApp();
  $useAuth().logout("/auth");
}
</script>
