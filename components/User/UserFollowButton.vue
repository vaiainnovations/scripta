<template>
  <span>
    <span v-if="!isAlreadyFollowing">
      <button
        class="bg-primary-text hover:bg-primary-text-light text-background-alt px-3 py-0.5 rounded-md"
        @click="follow(props.address)"
      >
        Follow
      </button>
    </span>
    <span v-else>
      <button
        class="bg-danger hover:bg-danger/70 text-background-alt px-3 py-0.5 rounded-md"
        @click="unfollow(props.address)"
      >
        Unfollow
      </button>
    </span>
  </span>
</template>

<script lang="ts" setup>
import Long from "long";
import { MsgCreateRelationshipEncodeObject, MsgDeleteRelationshipEncodeObject } from "@desmoslabs/desmjs";
import { useAccountStore } from "~/core/store/AccountStore";

interface Props {
    dtag: string
    address: string
}

const props = defineProps<Props>();
const isAlreadyFollowing = ref(true);

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
  const success = await $useTransaction().directTx([msgFollow], [msgDetails], false);
  if (success) {
    isAlreadyFollowing.value = false;
  }
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
  const success = await $useTransaction().directTx([msgUnfollow], [msgDetails], false);
  if (success) {
    isAlreadyFollowing.value = false;
  }
}
</script>
