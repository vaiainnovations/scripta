import { defineStore } from "pinia";
import { Profile } from "@desmoslabs/desmjs-types/desmos/profiles/v3/models_profile";
import { v4 as uuidv4 } from "uuid";
import { MsgCreatePostEncodeObject, EncodeObject, MsgSaveProfileEncodeObject } from "@desmoslabs/desmjs";
import Long from "long";
import { useAccountStore } from "./AccountStore";
import { useBackendStore } from "./BackendStore";
import { useUserStore } from "./UserStore";
import { useDraftStore } from "./DraftStore";
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
        if (!cachedPost) {
          console.log("No KV cached post found for", externalID);
        }
      } else {
        try {
          cachedPost = await (await useBackendStore().fetch(`${useBackendStore().apiUrl}posts/${externalID}`, "GET", {}, "")).json() as PostExtended;
        } catch (e) {
          console.log(e);
        }
      }
      if (cachedPost) {
        const author: Profile = await useUserStore().getUser(cachedPost.author as any, true);
        if (author) {
          cachedPost.author = {
            address: (author.account as any).address,
            bio: author.bio,
            dtag: author.dtag,
            nickname: author.nickname,
            pictures: {
              cover: author.pictures.cover,
              profile: author.pictures.profile
            }
          };
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

    async savePost (): Promise<boolean> {
      const { $useTransaction, $useIpfs, $useDesmosNetwork } = useNuxtApp();

      // check if the user has a sectionId
      if (useAccountStore().sectionId <= 0) {
        // if not, create one
        if (useAccountStore().sectionId === -10) {
          await useAccountStore().getUserSection(true);
          // TODO: handle failure?
        }
        let attempt = 0;
        // wait 10 attempts to create a sectionId, create the group, and user join it
        while (attempt < 10 && useAccountStore().sectionId <= 0) {
          // update the sectionId from the user endpoint
          await useAccountStore().getUserSection();

          // if found, break the loop
          if (useAccountStore().sectionId > 0) {
            break;
          }
          // otherwise, wait 5s and try again
          await new Promise(resolve => setTimeout(resolve, 5000));
          attempt++;
        }
      }
      if (useAccountStore().sectionId <= 0) {
        throw new Error("Could not get section id");
      }

      const draftStore = useDraftStore();
      const extId = useDraftStore().externalId || uuidv4();

      const msgCreatePost: MsgCreatePostEncodeObject = {
        typeUrl: "/desmos.posts.v2.MsgCreatePost",
        value: {
          subspaceId: Long.fromNumber($useDesmosNetwork().subspaceId),
          externalId: extId,
          attachments: [],
          author: useAccountStore().address,
          text: draftStore.title,
          sectionId: useAccountStore().sectionId,
          tags: useDraftStore().tags.map(tag => tag.content.value),
          conversationId: Long.fromNumber(0),
          referencedPosts: [],
          replySettings: 1
        }
      };

      // craft a custom object for IPFS
      const ipfsPost: any = {
        ...msgCreatePost.value,
        subtitle: draftStore.subtitle,
        content: draftStore.content
      };

      // upload the post to IPFS (without CID attachment), get the returned CID
      const postCid = await $useIpfs().uploadPost(JSON.stringify(ipfsPost));

      const postIpfsUrl = `${$useIpfs().gateway}${postCid}`;
      console.log(postIpfsUrl);

      const ipfsEntityUrl = {
        displayUrl: "IPFS",
        start: Long.fromNumber(0),
        end: Long.fromNumber(1),
        url: postIpfsUrl
      };

      // attach the CID to the Post as an entity
      msgCreatePost.value.entities = {
        hashtags: [],
        mentions: [],
        urls: [ipfsEntityUrl]
      };

      /* $useTransaction().push(msgCreatePost);
      const signedBytes = await $useTransaction().execute(); */

      // if is a new user and has no profile, create one with the randomly generated username
      const msgs: EncodeObject[] = [];
      const msgsDetails: any[] = [];
      if (useAccountStore().isNewProfile) {
        const msgSaveProfile: MsgSaveProfileEncodeObject = {
          typeUrl: "/desmos.profiles.v3.MsgSaveProfile",
          value: {
            dtag: useAccountStore().profile.dtag,
            nickname: useAccountStore().profile.nickname,
            bio: useAccountStore().profile.bio,
            profilePicture: useAccountStore().profile.pictures.profile,
            coverPicture: useAccountStore().profile.pictures.cover,
            creator: useAccountStore().address
          }
        };
        msgs.push(msgSaveProfile);
        msgsDetails.push({
          dtag: useAccountStore().profile.dtag,
          nickname: useAccountStore().profile.nickname,
          bio: useAccountStore().profile.bio,
          profile: useAccountStore().profile.pictures.profile,
          cover: useAccountStore().profile.pictures.cover,
          scriptaOp: "MsgSaveProfile"
        });
      }
      // push the post message
      msgs.push(msgCreatePost);
      msgsDetails.push({
        externalId: msgCreatePost.value.externalId,
        author: msgCreatePost.value.author,
        sectionId: msgCreatePost.value.sectionId,
        text: msgCreatePost.value.text,
        tags: msgCreatePost.value.tags,
        subtitle: useDraftStore().subtitle,
        content: useDraftStore().content,
        entities: JSON.stringify(msgCreatePost.value.entities),
        scriptaOp: "MsgCreatePost"
      });

      return await $useTransaction().directTx(msgs, msgsDetails);
    },
    async loadTrendings (): Promise<void> {
      let trendingPosts: PostExtended[] = [];

      // Load backend trending posts
      if (process.client) {
        try {
          trendingPosts = await (await useBackendStore().fetch(`${useBackendStore().apiUrl}trend/posts`, "POST", {
            "Content-Type": "application/json"
          })).json() as PostExtended[];
        } catch (e) {
          console.log(e);
        }
      }

      // Load KV trending posts
      const kvTrendingPosts = useState("trendingPosts", () => []); // create shared client/server state for the trending posts
      if (process.server) {
        kvTrendingPosts.value = await TrendingPostsKv.get("1") || [];
      }

      // Merge the two trending posts
      this.trendings = trendingPosts.concat(kvTrendingPosts.value);

      // remove duplicates
      this.trendings = this.trendings.filter((value, index, self) =>
        index === self.findIndex(t => (
          t.externalId === value.externalId
        ))
      );

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
