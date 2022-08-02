<template>
  <div class="flex flex-col pl-6 gap-y-2">
    <p class="text-2xl font-bold">
      Wallet
    </p>
    <div class="flex flex-row gap-x-3">
      <img
        src="/svg/wallet/dpm/logo.svg"
        class="h-5 w-5 object-contain"
      >
      <p class="text-xl font-medium">
        {{ useAccountStore().balance }} {{ useDesmosStore().coinDenom.toUpperCase() }}
      </p>
    </div>
    <button
      class="px-1 py-0.5 hover:text-danger rounded-2xl w-1/3 md:w-1/4 pt-4"
      @click="logout()"
    >
      <div class="flex">
        <img
          src="/icons/linear/logout.svg"
          class="h-5 w-5 object-contain mr-4 stroke-background my-auto"
        >
        Logout
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useAccountStore } from "~~/core/store/AccountStore";
import { useDesmosStore } from "~~/core/store/DesmosStore";

function logout () {
  const { $useAuth } = useNuxtApp();
  $useAuth().logout("/auth");
}
</script>
