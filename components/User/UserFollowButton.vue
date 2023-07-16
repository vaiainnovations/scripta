<template>
  <ClientOnly>
    <span v-if="useAccountStore().inited && props.address != useAccountStore().address">
      <span v-if="isLoading">
        <div
          class="bg-primary-text-light text-background-alt p-1 rounded-full w-7"
        >
          <SkeletonSpinner class="mx-auto " />
        </div>
      </span>
      <span v-else>
        <span v-if="!follows.includes(props.address)">
          <button
            class="bg-primary-text/75 hover:bg-primary-text text-background-alt p-1 rounded-full"
            @click="follow(props.address)"
          >
            <img
              class="h-6 w-6"
              src="/icons/linear/profile-add.svg"
              loading="lazy"
            >
          </button>
        </span>
        <span v-else>
          <button
            class="bg-danger hover:bg-danger/75 text-background-alt p-1 rounded-full"
            @click="unfollow(props.address)"
          >
            <img
              class="h-6 w-6"
              src="/icons/linear/profile-remove.svg"
              loading="lazy"
            >
          </button>
        </span>
      </span>
    </span>
  </ClientOnly>
</template>

<script lang="ts" setup>
import Long from "long";
import { MsgCreateRelationshipEncodeObject, MsgDeleteRelationshipEncodeObject } from "@desmoslabs/desmjs";
import { useAccountStore } from "~/core/store/AccountStore";

interface Props {
  dtag: string
  address: string
  follows: string[]
}

const props = defineProps<Props>();
const isAlreadyFollowing = ref(props.follows.includes(props.address));
const isLoading = ref(false);

async function follow (addressToFollow: string) {
  const { $useTransaction, $useDesmosNetwork } = useNuxtApp();
  const msgFollow: MsgCreateRelationshipEncodeObject = {
    typeUrl: "/desmos.relationships.v1.MsgCreateRelationship",
    value: {
      subspaceId: Long.fromNumber($useDesmosNetwork().subspaceId),
      signer: useAccountStore().address,
      counterparty: addressToFollow
    }
  };
  const msgDetails = {
    scriptaOp: "MsgCreateRelationship",
    counterparty: addressToFollow
  };
  isLoading.value = true;
  const success = await $useTransaction().directTx([msgFollow], [msgDetails], false);
  if (success) {
    await useAccountStore().updateUserFollows(); // update the user follows
    isAlreadyFollowing.value = useAccountStore().follows.includes(props.address);
  }
  isLoading.value = false;
}

async function unfollow (addressToUnfollow: string) {
  const { $useTransaction, $useDesmosNetwork } = useNuxtApp();
  const msgUnfollow: MsgDeleteRelationshipEncodeObject = {
    typeUrl: "/desmos.relationships.v1.MsgDeleteRelationship",
    value: {
      subspaceId: Long.fromNumber($useDesmosNetwork().subspaceId),
      signer: useAccountStore().address,
      counterparty: addressToUnfollow
    }
  };
  const msgDetails = {
    scriptaOp: "MsgDeleteRelationship",
    counterparty: addressToUnfollow
  };
  isLoading.value = true;
  const success = await $useTransaction().directTx([msgUnfollow], [msgDetails], false);
  if (success) {
    await useAccountStore().updateUserFollows(); // update the user follows
    isAlreadyFollowing.value = useAccountStore().follows.includes(props.address);
  }
  isLoading.value = false;
}
</script>
