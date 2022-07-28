import { defineStore } from "pinia";
import { useBackendStore } from "./BackendStore";
import { registerModuleHMR } from ".";
import { PostKv } from "~~/types/PostKv";
import { PostExtended } from "~~/types/PostExtended";

export const usePostStore = defineStore({
  id: "PostStore",
  state: () => ({
    userPosts: [] as any[],
    cachedPosts: new Map<string, any>()
  }),
  actions: {
    /**
     * Get the Post from the given externalID. If available, use SSR KV record
     * @param externalId Post `externalId`
     * @returns Post
     */
    async getPost (externalID: string): Promise<PostExtended> {
      if (!process.client) {
        const cachedPost = await PostKv.get(externalID);
        console.log(cachedPost);
        return cachedPost as any;
      }
      try {
        return await (await fetch(`${useBackendStore().apiUrl}posts/${externalID}`)).json() as PostExtended;
      } catch (e) {
        console.log(e);
        // TODO: handle the error properly
      }
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(usePostStore);