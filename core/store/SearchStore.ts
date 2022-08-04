import { defineStore } from "pinia";
import { useBackendStore } from "./BackendStore";
import { useUserStore } from "./UserStore";
import { registerModuleHMR } from ".";
import { PostExtended } from "~~/types/PostExtended";

export const useSearchStore = defineStore({
  id: "SearchStore",
  state: () => ({
    articleResults: [] as PostExtended[]
  }),
  actions: {
    async search (query: string): Promise<PostExtended []> {
      const res = (await (await fetch(`${useBackendStore().apiUrl}search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ q: query })
      })).json() as PostExtended[]);
      if (res && res.length >= 0) {
        this.articleResults = res;
        this.articleResults.forEach((article) => {
          useUserStore().getUser(article.author, true);
        });
        return res;
      }
      return [];
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useSearchStore);
