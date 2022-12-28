import { defineStore } from "pinia";
import { useBackendStore } from "./BackendStore";
import { useConfigStore } from "./ConfigStore";
import { registerModuleHMR } from ".";
import { PostExtended, searchFirstContentImage } from "~~/types/PostExtended";

export const useUserStore = defineStore({
  id: "UserStore",
  state: () => ({
    users: new Map<string, any>()
  }),
  actions: {
    async getUser (username: string, useCache = false): Promise<any> {
      const cachedUser = this.users.get(username);
      if (cachedUser && useCache) {
        return cachedUser;
      }
      try {
        const res = (await (await fetch(`${useConfigStore().lcdUrl}desmos/profiles/v3/profiles/${username}`)).json() as any);
        if (res.profile) {
          const user = res.profile as any;
          this.users.set(username, user);
          return user;
        }
      } catch (e) {
        // profile not found
      }
      return null;
    },
    async getUserArticles (address: string): Promise<PostExtended []> {
      let posts = [];
      try {
        posts = await (await useBackendStore().fetch(`${useBackendStore().apiUrl}search/posts`, "POST", {
          "Content-Type": "application/json"
        },
        JSON.stringify({ q: "", author: address })
        )).json() as PostExtended [];
        for (let i = 0; i < posts.length; i++) {
          posts[i].image = searchFirstContentImage(posts[i].content) || "/img/author_pic.png";
        }
      } catch (e) { return []; }
      return (posts.length > 0 ? posts : []);
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useUserStore);
