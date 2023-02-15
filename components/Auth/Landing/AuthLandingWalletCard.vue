<template>
  <div
    class="flex h-fit w-full flex-row items-center justify-center rounded-2xl bg-background-alt py-2 pl-4 pr-2 md:rounded-3xl"
  >
    <NuxtLink :to="props.wallet.route" class="w-full">
      <div class="flex flex-row items-center justify-between">
        <div class="flex flex-row items-center justify-start gap-x-4">
          <img :src="props.wallet.img" class="h-10 w-10  object-fill">
          <p class="text-primary-text xl:text-lg">
            {{ props.wallet.name }}
          </p>
        </div>
        <div v-if="props.wallet.isSuggested" class="rounded-md bg-primary p-1">
          <p class="text-[0.6rem] tracking-widest text-[#FFFFFF]">
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
  wallet: AuthWalletType;
}

const props = defineProps<Props>();
</script>
