import { defineStore } from "pinia";
import { useBackendStore } from "./BackendStore";
import { useConfigStore } from "./ConfigStore";
import { usePostStore } from "./PostStore";
import { registerModuleHMR } from ".";
import { PostExtended } from "~~/types/PostExtended";
import { Author } from "~~/types/Author";

export const useUserStore = defineStore({
  id: "UserStore",
  state: () => ({
    users: new Map<string, any>(),
    authors: new Map<string, Author>()
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

          // if possitble, replace the user's profile picture with the one from the IPFS Read gateway
          try {
            user.pictures.profile = user.pictures.profile.replace(useConfigStore().ipfsGateway, useConfigStore().ipfsGatewayRead);
          } catch (e) { /* ignore */ }

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
          posts[i].image = usePostStore().getArticlePreviewImage(posts[i]) || "/img/author_pic.png";
        }
      } catch (e) { return []; }
      return (posts.length > 0 ? posts : []);
    },
    /**
     * Load on authors state the new requested author's profiles
     * @param usernames array of authors address
     */
    async getAuthors (usernames: string[]): Promise<any> {
      const query = `query profiles {
        profile_aggregate(where: {address: {_in: ${JSON.stringify(usernames)}}}) {
          nodes {
            address
            dtag
            nickname
            bio
            profile_pic
            cover_pic
          }
        }
      }`;
      const usersRaw = await (await useBackendStore().fetch(`${useBackendStore().apiUrl}/graphql`, "POST", {
        "Content-Type": "application/json"
      }, JSON.stringify({
        q: query,
        type: "desmos"
      }))).json() as any;
      if (usersRaw && usersRaw.data && usersRaw.data.profile_aggregate.nodes[0]) {
        usersRaw.data.profile_aggregate.nodes.forEach((author: any) => {
          this.authors.set(author.address, {
            address: author.address,
            bio: author?.bio || "",
            dtag: author.dtag,
            nickname: author?.nickname || "",
            pictures: {
              cover: author?.cover_pic || "",
              profile: author?.profile_pic || ""
            }
          });
        });
      }
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useUserStore);
