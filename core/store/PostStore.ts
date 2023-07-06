import { defineStore } from "pinia";
import { Profile } from "@desmoslabs/desmjs-types/desmos/profiles/v3/models_profile";
import { Url } from "@desmoslabs/desmjs-types/desmos/posts/v3/models";
import { v4 as uuidv4 } from "uuid";
import { MsgCreatePostEncodeObject, EncodeObject, MsgSaveProfileEncodeObject } from "@desmoslabs/desmjs";
import Long from "long";
import { registerModuleHMR } from "~~/core/store";
import { useAccountStore } from "~~/core/store/AccountStore";
import { useIpfsStore } from "~~/core/store/IpfsStore";
import { useUserStore } from "~~/core/store/UserStore";
import { useDraftStore } from "~~/core/store/DraftStore";
import { useConfigStore } from "~~/core/store/ConfigStore";
import { useBackendStore } from "~~/core/store/BackendStore";
import { PostExtended } from "~~/types/PostExtended";

export const usePostStore = defineStore({
  id: "PostStore",
  state: () => ({
    trendings: useState("trendings", () => [] as PostExtended[]),
    related: useState("related", () => [] as PostExtended[]),
    latest: useState("latest", () => [] as PostExtended[]),
    userPosts: [] as any[],
    cachedPosts: new Map<string, any>()
  }),
  actions: {
    /**
     * Get the Post from the given externalID. If available, use SSR KV record
     * @param externalId Post `externalId`
     * @returns Post
     */
    async getPost (externalID: string): Promise<PostExtended | null> {
      let cachedPost: PostExtended | false = false;
      // If SSR, try to get the post from KV
      if (process.server) {
        try {
          const postRaw = await useFetch(`/api/kv/post/${externalID}`);
          if (postRaw && postRaw.data.value && postRaw.data.value.success) {
            cachedPost = JSON.parse(postRaw.data.value.post) as PostExtended;
          }
        } catch (e) {
          console.log("Error accessing Cloudflare KV");
        }
        if (!cachedPost) {
          console.log("No KV cached post found for", externalID);
        }
      }
      // If not SSR or not found in KV, get it from the backend
      if (!cachedPost) {
        try {
          cachedPost = await (await useBackendStore().fetch(`${useBackendStore().apiUrl}posts/${externalID}`, "GET", {}, "")).json() as PostExtended;
          cachedPost.content = cachedPost.content.replaceAll(useConfigStore().ipfsGateway, useConfigStore().ipfsGatewayRead);
        } catch (e) {
          console.log(e);
        }
      }
      // If found, get the author profile
      if (cachedPost) {
        // if client, query all the user profile info
        if (process.client) {
          const author: Profile = await useUserStore().getUser(cachedPost.author as any, true);
          if (author) {
            cachedPost.author = {
              address: (author.account as any).address || cachedPost.author,
              bio: author.bio,
              dtag: author.dtag,
              nickname: author.nickname,
              pictures: {
                cover: author.pictures?.cover || "",
                profile: author.pictures?.profile || ""
              }
            };
          }
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
      const { $useTransaction, $useIpfsUploader, $useDesmosNetwork, $useNotification } = useNuxtApp();
      $useTransaction().assertBalance("/profile");

      // check if the user has a sectionId
      if (useAccountStore().sectionId <= 0) {
        // if not, create one
        if (useAccountStore().sectionId === -10) {
          try {
            await useAccountStore().getUserSection(true);
          } catch (e) {
            $useNotification().error("Ops, an error", "Please retry later", 7);
          }
        }
        let attempt = 0;
        // wait 10 attempts to create a sectionId, create the group, and user join it
        while (attempt < 7 && useAccountStore().sectionId <= 0) {
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
      useDraftStore().externalId = extId;

      // filter out empty tags
      const tags = useDraftStore().tags.filter(tag => tag.content.value !== "" ? tag.content.value : null);

      const msgCreatePost: MsgCreatePostEncodeObject = {
        typeUrl: "/desmos.posts.v3.MsgCreatePost",
        value: {
          subspaceId: Long.fromNumber(Number($useDesmosNetwork().subspaceId)),
          externalId: extId,
          attachments: [],
          author: useAccountStore().address,
          text: draftStore.title,
          sectionId: useAccountStore().sectionId,
          tags: tags.map(tag => tag.content.value),
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
      const postCid = await $useIpfsUploader().uploadPost(JSON.stringify(ipfsPost));

      const postIpfsUrl = `${$useIpfsUploader().gateway}${postCid}`;

      const entityUrls = [] as Url[];
      const ipfsEntityUrl = {
        displayUrl: "IPFS",
        start: Long.fromNumber(0),
        end: Long.fromNumber(1),
        url: postIpfsUrl
      };
      entityUrls.push(ipfsEntityUrl);

      if (!draftStore.previewImage) {
        draftStore.previewImage = usePostStore().searchFirstContentImage(draftStore.content);
      }
      if (draftStore.previewImage) {
        const ipfsImagePreviewUrl = {
          displayUrl: "preview",
          start: Long.fromNumber(2),
          end: Long.fromNumber(3),
          url: draftStore.previewImage
        };
        entityUrls.push(ipfsImagePreviewUrl);
      }

      // attach the CID to the Post as an entity
      msgCreatePost.value.entities = {
        hashtags: [],
        mentions: [],
        urls: entityUrls
      };

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
      try {
        trendingPosts = await (await useBackendStore().fetch(`${useBackendStore().apiUrl}trend/posts`, "POST", {
          "Content-Type": "application/json"
        })).json() as PostExtended[];
      } catch (e) {
        console.log(e);
      }

      // Load KV trending posts
      let kvTrendingPosts = []; // create shared client/server state for the trending posts
      if (process.server) {
        try {
          const trendingPostsRaw = await useFetch("/api/kv/trendings");
          if (trendingPostsRaw && trendingPostsRaw.data.value && trendingPostsRaw.data.value.success) {
            kvTrendingPosts = JSON.parse(trendingPostsRaw.data.value.post) as PostExtended[];
          }
        } catch (e) {}
      }

      // Merge the two trending posts
      if (kvTrendingPosts.length > 0 || trendingPosts.length > 0) {
        this.trendings = trendingPosts.concat(kvTrendingPosts);
      }

      // remove duplicates
      this.trendings = this.trendings.filter((value, index, self) =>
        index === self.findIndex(t => (
          t.externalId === value.externalId
        ))
      );

      const authors: [] = [];
      if (this.trendings.length > 0) {
        for (let i = 0; i < this.trendings.length; i++) {
          const author = useUserStore().authors.get(this.trendings[i].author);
          if (!this.trendings[i].author?.dtag && !author) {
            authors.push(this.trendings[i].author);
          }
          this.trendings[i].image = this.getArticlePreviewImage(this.trendings[i]) || "/img/author_pic.png";
        }
      }

      // Get or load posts authors profile
      try {
        useUserStore().getAuthors(authors).then(() => {
          for (let i = 0; i < this.trendings.length; i++) {
            const author = useUserStore().authors.get(this.trendings[i].author);
            if (author) {
              this.trendings[i].author = author;
            }
          }
        });
      } catch (e) {
        // do nothing
      }
    },
    /**
     * Get the latest published posts
     * @param refresh true to force a refresh from the backend
     * @returns latest posts
     */
    async getRelatedPosts (refresh = false): Promise<PostExtended[]> {
      if (this.related.length > 0 && !refresh) {
        return this.related;
      }
      const authors: [] = [];

      // fetch the related posts from the backend
      try {
        this.related = await (await useBackendStore().fetch(`${useBackendStore().apiUrl}related/posts`, "POST", {
          "Content-Type": "application/json"
        })).json() as PostExtended[];
        // handle preview images
        for (let i = 0; i < this.related.length; i++) {
          this.related[i].image = this.getArticlePreviewImage(this.related[i]) || "/img/author_pic.png";
          const author = useUserStore().authors.get(this.related[i].author);
          if (!this.related[i].author?.dtag && !author) {
            authors.push(this.related[i].author);
          }
        }
      } catch (error) {
        console.error(error);
      }

      // Get or load posts authors profile
      try {
        await useUserStore().getAuthors(authors).then(() => {
          for (let i = 0; i < this.related.length; i++) {
            const author = useUserStore().authors.get(this.related[i].author);
            if (author) {
              this.related[i].author = author;
            }
          }
        });
      } catch (e) {
        // do nothing
      }
      return this.related;
    },
    /**
     * Get the latest published posts
     * @param refresh true to force a refresh from the backend
     * @returns latest posts
     */
    async getLatestPosts (refresh = false): Promise<PostExtended[]> {
      if (this.latest.length > 0 && !refresh) {
        return this.latest;
      }
      const authors: [] = [];

      // fetch the latest posts from the backend
      try {
        this.latest = await (await useBackendStore().fetch(`${useBackendStore().apiUrl}latest/posts`, "POST", {
          "Content-Type": "application/json"
        })).json() as PostExtended[];
        // handle preview images
        for (let i = 0; i < this.latest.length; i++) {
          this.latest[i].image = this.getArticlePreviewImage(this.latest[i]) || "/img/author_pic.png";
          const author = useUserStore().authors.get(this.latest[i].author);
          if (!this.latest[i].author?.dtag && !author) {
            authors.push(this.latest[i].author);
          }
        }
      } catch (error) {
        console.error(error);
      }

      // Get or load posts authors profile
      try {
        await useUserStore().getAuthors(authors).then(() => {
          for (let i = 0; i < this.latest.length; i++) {
            const author = useUserStore().authors.get(this.latest[i].author);
            if (author) {
              this.latest[i].author = author;
            }
          }
        });
      } catch (e) {
        // do nothing
      }
      return this.latest;
    },
    searchFirstContentImage (content: string): string {
      const match = /!\[[^\]]*\]\((?<filename>.*?)(?="|\))(?<optionalpart>".*")?\)/.exec(content);
      if (match) {
        let img = match[1];
        // handle the case where the image is base64 format
        img = img.replace("data\\:", "data:");
        try {
          const ipfsUrl = (useIpfsStore().ipfsUrlToGatewayRead(img));
          if (ipfsUrl !== false) {
            return ipfsUrl;
          }
        } catch (e) {
          // nothing
        }
        return img;
      }
      return "";
    },

    getArticlePreviewImage (article: PostExtended): string | false {
      // get the preview image from the content or from the entity (with priority)
      let previewImage = usePostStore().searchFirstContentImage(article?.content || "") || "";
      try {
        article?.entities?.urls?.forEach((entity) => {
          if (entity.display_url === "preview" || entity.displayUrl === "preview") {
            previewImage = entity.url;
            // replace the ipfs gateway with the read one
            previewImage = previewImage.replace(useConfigStore().ipfsGateway, useConfigStore().ipfsGatewayRead);
          }
        });
      } catch (e) {
        // no entity preview
      }
      return previewImage || false;
    },
    async updateUserPosts (): Promise<void> {
      try {
        this.userPosts = await useUserStore().getUserArticles(useAccountStore().address);
      } catch (e) {
        this.userPosts = [];
        console.log(e);
      }
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(usePostStore);
