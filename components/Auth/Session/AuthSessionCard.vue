<template>
  <AuthCard>
    <template #card>
      <spam v-if="!isGeneratingToken">
        <AuthContentCard>
          <AuthDescription class="p-5">
            <p class="text-3xl font-extrabold leading-normal text-center pt-5">
              Wanna try an improved Web3 experience?
            </p>
            <p class="text-lg leading-normal pt-10 text-center">
              By granting to Scripta.network the Authorization to sign <b>only</b> Scripta related operations on your behalf, you won’t have to sign every post/comment/reaction, but only a session authorization.
              <br><br>It’s free and you can revoke this authorization whenever you want!
            </p>

            <div class="pt-12">
              <div class="text-center p-4">
                <button class="rounded-xl py-2 px-4 text-xl bg-primary text-background-alt hover:bg-primary/70">
                  Try the experience
                </button>
              </div>
              <div class="text-center">
                <button
                  class="rounded-xl py-2 px-4 text-xl bg-primary text-background-alt hover:bg-primary/70"
                  @click="continueWithoutAuthz()"
                >
                  Continue without
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
      </spam>
      <span v-else>
        <AuthContentCard class="flex-row items-center justify-center py-32 md:py-16 xl:py-36">
          <div class="flex flex-col items-center justify-center gap-y-8">
            <div class="px-8 py-10">
              <img
                src="/svg/spinner/dots.svg"
                class="h-8 object-contain"
              >
            </div>
            <p class="pt-10 text-2xl font-bold tracking-widest text-primary-text-light">
              Loading
            </p>
          </div>
        </AuthContentCard>
      </span>
    </template>
  </AuthCard>
</template>

<script setup lang="ts">
import { AuthLevel } from "~~/core/store/AuthStore";

const isGeneratingToken = ref(false);

if (process.client) {
  init();
}

function init () {
  const { $useAuth } = useNuxtApp();
  const authLevel = $useAuth().authLevel;

  switch (authLevel) {
  case AuthLevel.Wallet:
    // ask session token or authz creation
    break;

  case AuthLevel.Session:
    // handle session token
    break;

  default:
    break;
  }
}

function logout () {
  const { $useAuth } = useNuxtApp();
  $useAuth().logout("/");
}

async function continueWithoutAuthz () {
  isGeneratingToken.value = true;
  const { $useAuth } = useNuxtApp();
  await $useAuth().authorize();
  isGeneratingToken.value = false;
}
</script>
