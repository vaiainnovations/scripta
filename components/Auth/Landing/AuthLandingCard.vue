<template>
  <AuthCard>
    <template #card>
      <AuthContentCard>
        <AuthDescription>
          <p class="text-2xl font-extrabold leading-normal">
            Connect your Wallet.
          </p>
          <p class="text-lg leading-normal">
            Connect using one of the available wallet connection providers or setup a new one.
          </p>
        </AuthDescription>
        <AuthStatusCard>
          <AuthLandingWalletList :content="mobile" />
          <AuthLandingWalletList class="hidden md:block" :content="desktop" />
        </AuthStatusCard>
      </AuthContentCard>
    </template>
    <template #buttons>
      <AuthButtonsBack>
        <AuthButtonsBackRouting to="/" />
      </AuthButtonsBack>
    </template>
  </AuthCard>
</template>

<script setup lang="ts">
import { AuthWallet } from "@/types/AuthWalletType";

const mobile = {
  type: "Mobile",
  wallets: [
    new AuthWallet("Desmos App", "svg/wallet/dpm/logo.svg", "/auth/desmos-app", true),
    new AuthWallet("WalletConnect", "svg/wallet/walletconnect/logo.svg", "/auth/wallet-connect")
  ]
};

const desktop = {
  type: "Desktop",
  wallets: [
    new AuthWallet("Keplr", "svg/wallet/keplr/logo.svg", "/auth/keplr")
  ]
};
</script>
