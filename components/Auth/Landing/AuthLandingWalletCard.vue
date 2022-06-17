<template>
  <div class="bg-background-alt flex flex-row justify-center items-center w-full h-fit rounded-2xl md:rounded-3xl pl-4 pr-2 py-2">
    <NuxtLink :to="props.wallet.route" class="w-full">
      <div class="flex flex-row justify-between items-center">
        <div class="flex flex-row justify-start items-center gap-x-4">
          <img :src="props.wallet.img" class="object-fill h-8">
          <p class="text-primary-text">
            {{ props.wallet.name }}
          </p>
        </div>
        <div v-if="props.wallet.isSuggested" class="bg-primary rounded-md p-1">
          <p class="text-[6px] tracking-widest text-[#FFFFFF]">
            Suggested
          </p>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { AuthWalletType } from "~~/types/AuthWalletType";

interface Props {
  wallet: AuthWalletType
}

const props = defineProps<Props>();
</script>
