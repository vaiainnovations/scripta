import { defineStore } from "pinia";
/* import { useBackendStore } from "./BackendStore"; */

import Long from "long";
import { RegisteredReactionValue } from "@desmoslabs/desmjs-types/desmos/reactions/v1/models";
import { MsgAddReactionEncodeObject } from "@desmoslabs/desmjs";
import { useDesmosStore } from "./DesmosStore";
import { useAccountStore } from "./AccountStore";
import { registerModuleHMR } from ".";

export const useReactionStore = defineStore({
  id: "ReactionStore",
  state: () => ({
  }),
  actions: {
    addReaction (reactionCode: any, postId: Long) {
      const { $useTransaction } = useNuxtApp();
      console.log(reactionCode);
      console.log(postId);
      const msgAddReaction: MsgAddReactionEncodeObject = {
        typeUrl: "/desmos.reactions.v1.MsgAddReaction",
        value: {
          subspaceId: Long.fromNumber(useDesmosStore().subspaceId),
          postId,
          user: useAccountStore().address,
          value: {
            typeUrl: "/desmos.reactions.v1.RegisteredReactionValue",
            value: RegisteredReactionValue.encode({
              registeredReactionId: 1
            }).finish()
          }
        }
      };
      console.log(msgAddReaction);
      $useTransaction().push(msgAddReaction);
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useReactionStore);
