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
        <span v-if="!isConnecting">
          Connect
        </span>
        <span v-else>
          <SkeletonSpinner />
        </span>
      </AuthStatusButton>
    </AuthStatusCard>
  </AuthContentCard>
</template>

<script setup lang="ts">
const isConnecting = ref(false);
/**
 * Keplr Connection
 */
async function connect () {
  const { $useKeplr } = useNuxtApp();
  isConnecting.value = true;
  try {
    await $useKeplr().connect();
  } catch (e) {
    console.error(e);
  }
  isConnecting.value = false;
}
</script>
