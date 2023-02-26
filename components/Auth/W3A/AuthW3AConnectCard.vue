<template>
  <AuthContentCard>
    <AuthDescription>
      <p class="text-2xl font-extrabold">
        Social Login
      </p>
      <div>
        <p class="text-lg">
          Login with your preferred social account, and approve the authorization
        </p>
        <p class="text-sm text-gray">
          Always make sure to connect from
          <b><a class="text-green">https://</a>scripta.network</b>
        </p>
      </div>
    </AuthDescription>
    <AuthStatusCard>
      <img src="/svg/wallet/w3a/logo.svg" class="object-fill h-32">
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
  const { $useWeb3Auth } = useNuxtApp();
  isConnecting.value = true;
  try {
    await $useWeb3Auth().connect(true);
    useRouter().push("/profile");
  } catch (e) {
    console.error(e);
  }
  isConnecting.value = false;
}
</script>
