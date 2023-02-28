<template>
  <div class="mx-4">
    <!-- Faucet -->
    <section
      v-if="isFaucet&&useAccountStore().balance<=0&&useAccountStore().address"
      class="hover:cursor-pointer"
      @click="claimFaucet()"
    >
      <div class="rounded-xl bg-purple py-2 px-2">
        <span v-if="!isClaimingFaucet">
          <div class=" text-white font-bold">
            Free ${{ coinDenom }}
          </div>
          <div class="text-xs text-white font-bold">
            Claim your free ${{ coinDenom }} and start your journey!
          </div>
        </span>
        <span v-else>
          <div class=" text-white font-bold">
            Claiming!
          </div>
          <div class="text-xs text-white font-bold">
            Just a moment...
          </div>
        </span>
      </div>
    </section>
  </div>
</template>
<script lang="ts" setup>
import { useAccountStore } from "~~/core/store/AccountStore";
import { useBackendStore } from "~~/core/store/BackendStore";

const { $useDesmosNetwork, $useAuth } = useNuxtApp();

const coinDenom = ref("");

const isFaucet = ref(true);
const isClaimingFaucet = ref(false);

if (process.client) {
  coinDenom.value = $useDesmosNetwork().coinDenom.toUpperCase();
}

async function claimFaucet () {
  if (isClaimingFaucet.value) {
    return;
  }
  try {
    isClaimingFaucet.value = true;
    const res = await useBackendStore().fetch(
      `${useBackendStore().apiUrl}foster/faucet `,
      "POST",
      {},
      ""
    );
    if (res.status !== 200) {
      useNuxtApp().$useNotification().error("Claim Error", "An error occurred during the request, try later");
    }
    isClaimingFaucet.value = false;
    useAccountStore().updateUserAccount(); // refresh all profile infos
  } catch (e) {
    isClaimingFaucet.value = false;
    useNuxtApp().$useNotification().error("Claim Error", "An error occurred during the request, try later");
  }
}
</script>
