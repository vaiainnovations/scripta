import { defineStore } from "pinia";
import { useDesmosStore } from "./DesmosStore";
import { useBackendStore } from "./BackendStore";
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
      const res = (await (await fetch(`${useDesmosStore().lcd}desmos/profiles/v3/profiles/${username}`)).json() as any);
      if (res.profile) {
        const user = res.profile as any;
        this.users.set(username, user);
        return user;
      }
      return null;
    },
    async getUserArticles (address: string): Promise<PostExtended []> {
      const posts = await (await fetch(`${useBackendStore().apiUrl}search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ q: "", address })
      })).json() as PostExtended [];
      for (let i = 0; i < posts.length; i++) {
        posts[i].image = searchFirstContentImage(posts[i].content) || "/img/author_pic.png";
      }
      return (posts.length > 0 ? posts : null);
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useUserStore);
