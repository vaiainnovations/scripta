<template>
  <div class="bg-background-alt flex flex-col w-full gap-y-5 lg:flex-row lg:h-full lg:overflow-hidden">
    <!-- Mobile Hidden -->
    <div class="flex-col gap-y-14 lg:gap-y-0 lg:justify-evenly lg:w-1/3 py-14 lg:h-full hidden lg:flex">
      <ProfileUser :read-only="true" />
      <ProfileBalance />
    </div>

    <div class="lg:w-2/3 bg-background lg:overflow-y-auto lg:px-32 lg:py-10">
      <div class="mb-12 bg-background">
        <div class="flex py-4 md:pt-3 fixed w-full bg-background z-50">
          <div class="flex-1 my-auto">
            <NuxtLink to="/profile">
              <div class="flex">
                <img :src="'/icons/bold/arrow-left.svg'">
                <p class="text-gray-dark">
                  Back
                </p>
              </div>
            </NuxtLink>
          </div>
          <div class="flex-grow">
            <h1 class="font-bold text-2xl text-gray-dark">
              Settings
            </h1>
          </div>
        </div>
      </div>

      <div class="p-4 py-6">
        <!-- Privacy Settings -->
        <div class="py-4">
          <h1 class="font-semibold text-gray-dark">
            Privacy
          </h1>
          <div class="mt-2">
            <SettingsToggle v-model="hasAcceptedPrivacy" class="py-4 mb-4 bg-background-alt rounded-xl">
              <h1 class="font-bold text-xl">
                Privacy & Terms
              </h1>
              <p class="font-light">
                Agree with privacy and terms of the Scripta platform.
              </p>
            </SettingsToggle>
            <SettingsToggle v-model="hasAcceptedAdvertisement" class="py-4 mb-4 bg-background-alt rounded-xl">
              <h1 class="font-bold text-xl">
                Advertisement
              </h1>
              <p class="font-light">
                Agree with advertisement policy of the Scripta platform.
              </p>
            </SettingsToggle>
            <SettingsToggle v-model="hasAcceptedCookies" class="py-4 mb-4 bg-background-alt rounded-xl">
              <h1 class="font-bold text-xl">
                Cookies
              </h1>
              <p class="font-light">
                Agree with cookies policy of the Scripta platform.
              </p>
            </SettingsToggle>
          </div>
        </div>

        <!-- Web3 Settings -->
        <div class="py-4">
          <h1 class="font-semibold text-gray-dark">
            Web3
          </h1>
          <div class="mt-2">
            <SettingsToggle v-model="hasAuthzAuthorization" class="py-4 mb-4 bg-background-alt rounded-xl" @change="handleAuthzAuthorizationChange">
              <h1 class="font-bold text-xl">
                Grant Authorization
              </h1>
              <div class="font-light">
                Authorize Scripta to sign new posts/comments/reactions on your behalf, you'll <b class="font-semibold">always</b> be the author of that content.
                In this way you will not have to sign every action, but only the authorization that you can revoke whenever you want.
                <div v-if="hasAuthzAuthorization" class="pt-1 text-gray text-sm text-right">
                  Expiration: {{ useAccountStore().authz.grantExpiration.toLocaleString() }}
                </div>
              </div>
            </SettingsToggle>
          </div>
        </div>

        <!-- App info -->
        <div class="pt-16 flex">
          <div class="w-full">
            <img
              src="/logo/logo.svg"
              class="rounded-full w-8 h-8 mx-auto pointer-events-none select-none"
            >
            <div class="text-center pt-2">
              <h6 class="text-sm">
                Scripta v1.0.0 ()
              </h6>
              <h6 class="text-xs text-gray-dark">
                {{ useDesmosStore().chainId }}
              </h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAccountStore } from "~~/core/store/AccountStore";
import { useDesmosStore } from "~~/core/store/DesmosStore";

const hasAcceptedPrivacy = ref(true);
const hasAcceptedAdvertisement = ref(false);
const hasAcceptedCookies = ref(false);
const hasAuthzAuthorization = ref(new Date(Date.now()) < useAccountStore().authz.grantExpiration);

// subscribe to changes in the account store, the first call to the Account endpoint is async, so it is necessary
useAccountStore().$subscribe(() => {
  hasAcceptedPrivacy.value = true;
  hasAcceptedAdvertisement.value = false;
  hasAcceptedCookies.value = false;
  hasAuthzAuthorization.value = new Date(Date.now()) < useAccountStore().authz.grantExpiration;
});

async function handleAuthzAuthorizationChange () {
  if (hasAuthzAuthorization.value) {
    console.log("grant authorization");
    const success = await useAccountStore().grantAuthorizations();
    console.log("grant authorization", success);
  } else {
    const success = await useAccountStore().revokeAuthorizations();
    console.log("revoke authorization", success);
  }
}
</script>
