import { defineStore } from "pinia";
import { useAccountStore } from "./AccountStore";
import { useBackendStore } from "./BackendStore";
import { useUserStore } from "./UserStore";
import { useLogStore } from "./LogStore";
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
      let cachedPost: PostExtended | false = false;
      if (!process.client) {
        cachedPost = await PostKv.get(externalID);
        if (cachedPost) {
          useLogStore().logOp({ scriptaOp: "getPost", externalID });
        } else {
          console.log("No KV cached post found for", externalID);
        }
      } else {
        try {
          cachedPost = await (await useBackendStore().fetch(`${useBackendStore().apiUrl}posts/${externalID}`, "GET", {}, "")).json() as PostExtended;
        } catch (e) {
          console.log(e);
        }
      }
      return cachedPost || null;
    },
    async deletePost (extId: string, id: string, signedPost: Uint8Array): Promise<void> {
      try {
        await useBackendStore().fetch(`${useBackendStore().apiUrl}posts/delete/${extId}`, "POST", {
          "Content-Type": "application/json"
        }, JSON.stringify({
          id,
          signedPost: Buffer.from(signedPost).toString("base64")
        }));
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
    },
    async updateUserPosts (): Promise<void> {
      this.userPosts = await useUserStore().getUserArticles(useAccountStore().address);
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(usePostStore);
