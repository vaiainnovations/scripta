<template>
  <AuthCard>
    <template #card>
      <AuthContentCard>
        <AuthDescription>
          <p class="text-2xl font-extrabold leading-normal">
            Connect your Wallet.
          </p>
          <p class="text-lg leading-normal">
            Connect using one of the available wallet connection providers or
            setup a new one.
          </p>
        </AuthDescription>
        <AuthStatusCard>
          <AuthLandingWalletList
            :content="supportedAuthWallets.default"
          />
          <AuthLandingWalletList :content="supportedAuthWallets.mobile" />
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
import { supportedAuthWallets } from "~~/types/SupportedWallets";
</script>
