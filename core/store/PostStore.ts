import { defineStore } from "pinia";
import { useBackendStore } from "./BackendStore";
import { registerModuleHMR } from ".";
import { PostKv } from "~~/types/PostKv";
import { PostExtended, searchFirstContentImage } from "~~/types/PostExtended";
import { TrendingPostsKv } from "~~/types/TrendingPostsKv";

export const usePostStore = defineStore({
  id: "PostStore",
  state: () => ({
    trendings: [] as PostExtended[],
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
    },
    async deletePost (extId: string, id: string, signedPost: Uint8Array): Promise<void> {
      try {
        await fetch(`${useBackendStore().apiUrl}posts/delete/${extId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            id,
            signedPost: Buffer.from(signedPost).toString("base64")
          })
        });
      } catch (e) {
        console.log(e);
      }
    },
    async loadTrendings (): Promise<void> {
      const trendingPostsRaw = await TrendingPostsKv.get("1");
      this.trendings = trendingPostsRaw !== false ? trendingPostsRaw.slice(0, trendingPostsRaw.length - 1) : [];
      if (this.trendings.length > 0) {
        for (let i = 0; i < this.trendings.length; i++) {
          this.trendings[i].image = searchFirstContentImage(this.trendings[i].content) || "/img/author_pic.png";
        }
      }
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(usePostStore);
