import { defineStore } from "pinia";
import Long from "long";
import { RegisteredReactionValue } from "@desmoslabs/desmjs-types/desmos/reactions/v1/models";
import { MsgAddReactionEncodeObject } from "@desmoslabs/desmjs";
import { useDesmosStore } from "./DesmosStore";
import { useBackendStore } from "./BackendStore";
import { useAccountStore } from "./AccountStore";
import { registerModuleHMR } from ".";

export interface ArticleReaction {
  code: string,
  id: number
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
    addReaction (reactionCode: any, postId: Long) {
      const { $useTransaction } = useNuxtApp();
      const reactionId = this.getReaction(reactionCode).id;
      const msgAddReaction: MsgAddReactionEncodeObject = {
        typeUrl: "/desmos.reactions.v1.MsgAddReaction",
        value: {
          subspaceId: Long.fromNumber(useDesmosStore().subspaceId),
          postId,
          user: useAccountStore().address,
          value: {
            typeUrl: "/desmos.reactions.v1.RegisteredReactionValue",
            value: RegisteredReactionValue.encode({
              registeredReactionId: reactionId
            }).finish()
          }
        }
      };
      const index = $useTransaction().queue.findIndex(m => m.message.typeUrl === msgAddReaction.typeUrl && m.message.value?.postId === msgAddReaction.value.postId);
      (index < 0)
        ? $useTransaction().push(msgAddReaction, { scriptaOp: "MsgAddReaction" })
        : $useTransaction().queue[index].message = msgAddReaction;
    },
    async getUserPostReaction (postId: number):Promise<ArticleReaction> {
      const query = `query getPostReactions {
        userReaction: reaction(where:{post:{id:{_eq: ${postId} }}, _and:{author_address: {_eq:"${useAccountStore().address}"}}}, order_by:{id: desc}, limit:1) {
          reaction: value
        }
      }`;
      const reactionRaw = await (await useBackendStore().fetch(`${useBackendStore().apiUrl}/graphql`, "POST", {
        "Content-Type": "application/json"
      }, JSON.stringify({
        q: query,
        type: "desmos"
      }))).json() as any;
      if (reactionRaw && reactionRaw.data && reactionRaw.data.userReaction[0]) {
        return this.getReaction("", reactionRaw.data.userReaction[0].reaction.registered_reaction_id);
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
