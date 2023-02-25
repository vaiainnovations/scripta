<template>
  <AuthCard>
    <template #card>
      <span v-if="!isLoading">
        <AuthContentCard>
          <AuthDescription class="p-5">
            <span v-if="!hasAuthz&&suggestAuthz">
              <p class="text-3xl font-extrabold leading-normal text-center pt-5">
                Wanna try an improved Web3 experience?
              </p>
              <p class="text-lg leading-normal pt-10 text-center">
                By granting to Scripta.network the Authorization to sign <b>only</b> Scripta related operations on your behalf, you won’t have to sign every post/comment/reaction, but only a session authorization.
                <br><br>It’s free and you can revoke this authorization whenever you want!
              </p>
            </span>
            <span v-else>
              <p class="text-3xl font-extrabold leading-normal text-center pt-5">
                Welcome back
              </p>
              <p class="text-lg leading-normal pt-10 text-center">
                Your Authorization or device session has <b>expired</b>, please renew it.
              </p>
            </span>

            <div class="pt-12">
              <div v-if="!hasAuthz&&suggestAuthz" class="text-center p-4">
                <button
                  class="rounded-xl py-2 px-4 text-xl bg-primary text-background-alt hover:bg-primary/70"
                  @click="continueWithAuthz()"
                >
                  Try the experience
                </button>
              </div>
              <div class="text-center">
                <button
                  class="rounded-xl py-2 px-4 text-xl bg-primary text-background-alt hover:bg-primary/70"
                  @click="continueWithoutAuthz()"
                >
                  <span v-if="!hasValidAuthorization&&!hasAuthz">
                    <span v-if="!hasAuthz && suggestAuthz">
                      Continue without
                    </span>
                    <span v-else>
                      Continue
                    </span>
                  </span>
                  <span v-else>
                    Authorize device
                  </span>
                </button>
              </div>
            </div>

            <div class="pt-10 md:pt-20 text-center">
              <div
                class="text-gray text-sm hover:underline cursor-pointer"
                @click="logout()"
              >
                Logout
              </div>
            </div>
          </AuthDescription>
        </AuthContentCard>
      </span>
      <span v-else>
        <AuthContentCard class="flex-row items-center justify-center py-32 md:py-16 xl:py-36">
          <div class="flex flex-col items-center justify-center gap-y-8">
            <div class="px-8 py-10">
              <img
                src="/svg/spinner/dots.svg"
                class="h-8 object-contain"
              >
            </div>
            <div class="pt-10">
              <p class="text-2xl text-center font-bold tracking-widest text-primary-text-light">
                Loading
              </p>
              <span class="pt-4 text-sm font-normal text-primary-text-light">
                Unlock and Approve the session request in your Wallet
              </span>
            </div>
          </div>
        </AuthContentCard>
      </span>
    </template>
  </AuthCard>
</template>

<script setup lang="ts">
import { useAccountStore } from "~~/core/store/AccountStore";
import { SupportedSigner } from "~~/core/store/wallet/SupportedSigner";

const isLoading = ref(true);
const hasAuthz = ref(false);
const hasValidAuthorization = ref(false);
const suggestAuthz = ref(false);

// new authz
// renew token

// may be unnecessary since ensured by the [not-direct-route] guard
if (process.client) {
  const { $useAuth, $useWallet } = useNuxtApp();
  isLoading.value = false;
  hasAuthz.value = useAccountStore().authz.hasAuthz;
  hasValidAuthorization.value = $useAuth().hasValidAuthAuthorization();

  // auto sign the authorization if the user is using web3auth & no authz suggestion
  if ($useWallet().signerId === "web3auth" && !suggestAuthz.value) {
    await continueWithoutAuthz();
  }
}

function logout () {
  const { $useAuth } = useNuxtApp();
  $useAuth().logout("/");
}

async function continueWithoutAuthz () {
  useAccountStore().authz.hasAuthz = false;
  isLoading.value = true;
  const { $useAuth } = useNuxtApp();
  const success = await $useAuth().authorize();
  isLoading.value = false;

  if (success) {
    await navigateTo("/profile");
  } else {
    await navigateTo("/");
  }
}
async function continueWithAuthz () {
  isLoading.value = true;
  const { $useAuth } = useNuxtApp();
  const authorized = await $useAuth().authorize();

  if (!authorized) {
    isLoading.value = false;
    return false;
  }

  // retrieve the Authz Scripta configuration from the backend
  const authzConfig = await $useAuth().getAuthzConfig();

  if (!authzConfig) {
    isLoading.value = false;
    return false;
  }

  const success = await $useAuth().grantAuthorizations();
  isLoading.value = false;

  if (success) {
    await useAccountStore().getUserInfo(); // update the user info
    await navigateTo("/profile");
  }
}
</script>
