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
            <NuxtLink v-if="!isUpdating" to="/profile">
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

      <div v-if="isUpdating" class="py-10 w-full">
        <div class="flex flex-col pb-16">
          <SkeletonSettings v-for="n in 3" :key="n" />
        </div>
        <div class="mx-auto text-center w-full rounded-2xl mb-32 md:mb-0">
          <p class="text-lg text-primary-text/70 font-medium p-3">
            Updating
          </p>
          <img class="animate-pulse mx-auto w-10" src="/svg/spinner/dots.svg">
        </div>
      </div>

      <div v-else class="p-4 py-6">
        <!-- Privacy Settings -->
        <div class="py-4">
          <h1 class="font-semibold text-gray-dark">
            Privacy
          </h1>
          <div class="mt-2">
            <SettingsToggle v-model="hasAcceptedPrivacy" class="py-4 mb-4 bg-background-alt rounded-xl" @click="changePrivacySettings()">
              <h1 class="font-bold text-xl">
                Privacy & Terms
              </h1>
              <p class="font-light">
                Agree with <a href="" target="_blank" class="underline hover:text-primary-light">Privacy and Terms</a> of the Scripta platform.
              </p>
            </SettingsToggle>
            <SettingsToggle v-model="hasAcceptedAdvertisement" class="py-4 mb-4 bg-background-alt rounded-xl" @click="changePrivacySettings()">
              <h1 class="font-bold text-xl">
                Advertisement
              </h1>
              <p class="font-light">
                Agree with <a href="" target="_blank" class="underline hover:text-primary-light">Advertisement Policy</a> of the Scripta platform.
              </p>
            </SettingsToggle>
            <SettingsToggle v-model="hasAcceptedCookies" class="py-4 mb-4 bg-background-alt rounded-xl" @click="changePrivacySettings()">
              <h1 class="font-bold text-xl">
                Cookies
              </h1>
              <p class="font-light">
                Agree with <a href="" target="_blank" class="underline hover:text-primary-light">Cookies Policy</a> of the Scripta platform.
              </p>
            </SettingsToggle>

            <button v-if="arePrivacySettingsChanged" class="rounded-lg bg-primary-light/80 hover:bg-primary-light text-background-alt w-full py-2" @click="savePrivacySettings()">
              Save Changes
            </button>
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
                {{ useDesmosStore().chainInfo.chainId }}
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
import { useBackendStore } from "~~/core/store/BackendStore";
import { useDesmosStore } from "~~/core/store/DesmosStore";

const isUpdating = ref(false);

const hasAcceptedPrivacy = ref(true);
const hasAcceptedAdvertisement = ref(false);
const hasAcceptedCookies = ref(false);
const arePrivacySettingsChanged = ref(false);

const hasAuthzAuthorization = ref(false);

onMounted(() => {
  updateSettingsValues();
});

// subscribe to changes in the account store, the first call to the Account endpoint is async, so it is necessary
useAccountStore().$subscribe(() => {
  updateSettingsValues();
});

function changePrivacySettings () {
  arePrivacySettingsChanged.value = true;
}

async function savePrivacySettings () {
  isUpdating.value = true;

  const success = await useBackendStore().fetch(`${useBackendStore().apiUrl}user/${useAccountStore().address}`, "PUT", {
    "Content-Type": "application/json"
  }, JSON.stringify({
    sectionId: useAccountStore().sectionId,
    privacyNotifications: hasAcceptedPrivacy.value,
    privacyTracking: hasAcceptedCookies.value
  }));
  console.log(success);
  arePrivacySettingsChanged.value = false;
  isUpdating.value = false;
}

function updateSettingsValues () {
  hasAcceptedPrivacy.value = useAccountStore().settings.hasAcceptedPrivacy;
  hasAcceptedAdvertisement.value = useAccountStore().settings.hasAcceptedAdvertisement;
  hasAcceptedCookies.value = useAccountStore().settings.hasAcceptedCookies;
  hasAuthzAuthorization.value = useAccountStore().authz.hasAuthz;
}

async function handleAuthzAuthorizationChange () {
  const { $useAuth } = useNuxtApp();
  isUpdating.value = true;
  if (hasAuthzAuthorization.value) {
    const success = await $useAuth().grantAuthorizations();
    hasAuthzAuthorization.value = success;
  } else {
    const success = await $useAuth().revokeAuthorizations();
    hasAuthzAuthorization.value = !success;
  }
  isUpdating.value = false;
}
</script>
