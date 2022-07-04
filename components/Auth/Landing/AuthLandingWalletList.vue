<template>
  <div class="flex flex-col items-center w-full gap-y-1">
    <div>
      <p class="text-primary-text-light text-sm font-light text-center pb-1">
        {{ props.content.type }}
      </p>
    </div>
    <div class="flex flex-col items-center w-full gap-y-4 md:gap-y-3">
      <AuthLandingWalletCard
        v-for="wallet in props.content.wallets"
        :key="wallet.name"
        :wallet="wallet"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { AuthWalletType } from "@/types/AuthWalletType";

interface PlatformWallets {
  type: string,
  wallets: Array<AuthWalletType>
}

interface Props {
  content: PlatformWallets
}

const props = defineProps<Props>();
</script>
