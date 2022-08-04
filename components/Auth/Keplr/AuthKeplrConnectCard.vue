<template>
  <AuthContentCard>
    <AuthDescription>
      <p class="text-2xl font-extrabold">
        Connect
      </p>
      <div>
        <p class="text-lg">
          Click Continue and approve the authorization
        </p>
        <p class="text-sm text-gray">
          Always make sure to connect from
          <b><a class="text-green">https://</a>scripta.network</b>
        </p>
      </div>
    </AuthDescription>
    <AuthStatusCard>
      <img src="/svg/wallet/keplr/logo.svg" class="object-fill h-32">
      <AuthStatusButton class="bg-[#8C53B2]" @click="connect()">
        Connect
      </AuthStatusButton>
    </AuthStatusCard>
  </AuthContentCard>
</template>

<script setup lang="ts">
/**
 * Keplr Connection
 */
async function connect () {
  const { $useKeplr } = useNuxtApp();
  await $useKeplr().connect();
}
</script>
