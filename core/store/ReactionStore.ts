import { defineStore } from "pinia";
import Long from "long";
import { RegisteredReactionValue } from "@desmoslabs/desmjs-types/desmos/reactions/v1/models";
import { MsgAddReactionEncodeObject, MsgRemoveReactionEncodeObject } from "@desmoslabs/desmjs";
import { useBackendStore } from "./BackendStore";
import { useAccountStore } from "./AccountStore";
import { registerModuleHMR } from ".";

export interface ArticleReaction {
  code: string,
  id: number,
  reactionId: number,
}

export const useReactionStore = defineStore({
  id: "ReactionStore",
  state: () => ({
    registeredReactions: [{
      code: ":up:",
      id: 1
    }, {
      code: ":down:",
      id: 2
    }]
  }),
  actions: {
    /**
     * Remove the current reaction transaction of the given post from the tx queue
     * @param postId post id
     */
    removeCurrentPostReactionTx (postId: Long) {
      const { $useTransaction } = useNuxtApp();
      const index = $useTransaction().queue.findIndex(m => (m.message.typeUrl === "/desmos.reactions.v1.MsgAddReaction" || m.message.typeUrl === "/desmos.reactions.v1.MsgRemoveReaction") && m.message.value?.postId === postId);
      if (index >= 0) {
        $useTransaction().queue.splice(index, 1);
      }
    },
    /**
     * Add post reaction
     * @param postId post id
     * @param reactionCode reaction code (ex. :up:)
     */
    addReaction (postId: Long, reactionCode: any) {
      const { $useTransaction, $useDesmosNetwork } = useNuxtApp();
      const reactionId = reactionCode.id;
      const reactionValue = {
        typeUrl: "/desmos.reactions.v1.RegisteredReactionValue",
        value: RegisteredReactionValue.encode({
          registeredReactionId: reactionId
        }).finish()
      };
      const msgAddReaction: MsgAddReactionEncodeObject = {
        typeUrl: "/desmos.reactions.v1.MsgAddReaction",
        value: {
          subspaceId: Long.fromNumber($useDesmosNetwork().subspaceId),
          postId: Long.fromNumber(postId),
          user: useAccountStore().address,
          value: reactionValue
        }
      };
      this.removeCurrentPostReactionTx(postId);
      $useTransaction().push(msgAddReaction, { address: useAccountStore().address, id: postId, registeredReactionId: reactionId, scriptaOp: "MsgAddReaction" });
    },
    /**
     * Remove a reaction
     * @param postId post id
     * @param reactionId id of the reaction (note: not the registered reaction id)
     */
    removeReaction (postId: Long, reactionId: number) {
      const { $useTransaction, $useDesmosNetwork } = useNuxtApp();
      const msgRemoveReaction: MsgRemoveReactionEncodeObject = {
        typeUrl: "/desmos.reactions.v1.MsgRemoveReaction",
        value: {
          subspaceId: Long.fromNumber($useDesmosNetwork().subspaceId),
          postId,
          user: useAccountStore().address,
          reactionId
        }
      };
      this.removeCurrentPostReactionTx(postId);
      $useTransaction().push(msgRemoveReaction, { address: useAccountStore().address, id: postId, reactionId, scriptaOp: "MsgRemoveReaction" });
    },
    async getUserPostReaction (postId: number):Promise<ArticleReaction> {
      const query = `query getPostReactions {
        userReaction: reaction(where:{post:{id:{_eq: ${postId} }}, _and:{author_address: {_eq:"${useAccountStore().address}"}}}, order_by:{id: desc}, limit:1) {
          reaction: value,
          reactionId: id
        }
      }`;
      const reactionRaw = await (await useBackendStore().fetch(`${useBackendStore().apiUrl}/graphql`, "POST", {
        "Content-Type": "application/json"
      }, JSON.stringify({
        q: query,
        type: "desmos"
      }))).json() as any;
      if (reactionRaw && reactionRaw.data && reactionRaw.data.userReaction[0]) {
        const registeredReaction = this.getReaction("", reactionRaw.data.userReaction[0].reaction.registered_reaction_id);
        return {
          code: registeredReaction.code,
          id: registeredReaction.id,
          reactionId: reactionRaw.data.userReaction[0].reactionId
        };
      }
      return null;
    },
    /**
     * Get the reaction from the code or the id
     * @param code reaction code
     * @param reactionId reaction id
     * @returns Reaction
     */
    getReaction (code?: string, reactionId?: number): ArticleReaction {
      if (code) {
        return this.registeredReactions.find(reaction => reaction.code === code);
      }
      return this.registeredReactions.find(reaction => reaction.id === reactionId);
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useReactionStore);
