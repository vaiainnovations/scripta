<template>
  <div class="flex w-full flex-col items-center gap-y-1">
    <div>
      <p class="pb-1 text-center text-sm font-light text-primary-text-light">
        {{ props.content.type }}
      </p>
    </div>
    <div class="flex w-full flex-col items-center gap-y-4 md:gap-y-3">
      <AuthLandingWalletCard v-for="wallet in props.content.wallets" :key="wallet.name" :wallet="wallet" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { AuthWalletType } from "@/types/AuthWalletType";

interface PlatformWallets {
  type: string;
  wallets: Array<AuthWalletType>;
}

interface Props {
  content: PlatformWallets;
}

const props = defineProps<Props>();
</script>
