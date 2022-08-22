<template>
  <AuthCard>
    <template #card>
      <span v-if="!isGeneratingToken">
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
import { Buffer } from "buffer";
import { MsgGrantEncodeObject } from "@desmoslabs/desmjs";
import { Timestamp } from "cosmjs-types/google/protobuf/timestamp";
import { GenericAuthorization } from "cosmjs-types/cosmos/authz/v1beta1/authz";
import { useBackendStore } from "~~/core/store/BackendStore";
import { useAccountStore } from "~~/core/store/AccountStore";
import { useDesmosStore } from "~~/core/store/DesmosStore";

const isGeneratingToken = ref(false);

function logout () {
  const { $useAuth } = useNuxtApp();
  $useAuth().logout("/");
}

async function continueWithoutAuthz () {
  isGeneratingToken.value = true;
  const { $useAuth } = useNuxtApp();
  const success = await $useAuth().authorize();
  isGeneratingToken.value = false;

  if (success) {
    await navigateTo("/profile");
  }
}
async function continueWithAuthz () {
  isGeneratingToken.value = true;
  const { $useAuth, $useTransaction } = useNuxtApp();
  const authorized = await $useAuth().authorize();

  if (!authorized) {
    isGeneratingToken.value = false;
    return false;
  }

  // retrieve the Authz Scripta configuration from the backend
  let authzConfig = null as {
    grantee: string
  } | null;

  try {
    authzConfig = await (await useBackendStore().fetch(`${useBackendStore().apiUrl}authz`, "GET", {
      "Content-Type": "application/json"
    })).json();
  } catch (e) {
    console.log(e);
  }

  if (!authzConfig) {
    isGeneratingToken.value = false;
    return false;
  }

  // TODO: implement the custom subspace authorization
  const authorizations = [] as Uint8Array[];
  authorizations.push(GenericAuthorization.encode(GenericAuthorization.fromPartial({
    msg: "/desmos.posts.v2.MsgCreatePost"
  })).finish());
  authorizations.push(GenericAuthorization.encode(GenericAuthorization.fromPartial({
    msg: "/desmos.posts.v2.MsgEditPost"
  })).finish());
  authorizations.push(GenericAuthorization.encode(GenericAuthorization.fromPartial({
    msg: "/desmos.posts.v2.MsgDeletePost"
  })).finish());
  authorizations.push(GenericAuthorization.encode(GenericAuthorization.fromPartial({
    msg: "/desmos.profiles.v3.MsgSaveProfile"
  })).finish());

  // build the authorization message
  const grants = [] as MsgGrantEncodeObject[];

  authorizations.forEach((authorization) => {
    grants.push({
      typeUrl: "/cosmos.authz.v1beta1.MsgGrant",
      value: {
        grantee: authzConfig.grantee,
        granter: useAccountStore().address,
        grant: {
          authorization: {
            typeUrl: "/cosmos.authz.v1beta1.GenericAuthorization",
            value: authorization
          },
          expiration: Timestamp.fromPartial({
            nanos: 0,
            seconds: (+new Date() / 1000) + 60 * 60 * 24 * 3 // + 1 day
          })
        }
      }
    }
    );
  });
  const signed = await $useTransaction().directSign(grants, "Signed from Scripta", useDesmosStore().defaultFee, 1);
  if (!signed) {
    $useAuth().logout();
  }

  try {
    const res = (await (
      await useBackendStore().fetch(
        `${useBackendStore().apiUrl}authz`,
        "POST",
        {
          "Content-Type": "application/json"
        },
        JSON.stringify({
          grant: Buffer.from(signed).toString("base64")
        })
      )
    ).json()) as any; // TODO: wrap response as type/obj
    console.log(res);
  } catch (e) {}
  isGeneratingToken.value = false;
}
</script>
