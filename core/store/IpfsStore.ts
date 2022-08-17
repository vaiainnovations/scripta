import { defineStore } from "pinia";
import { create } from "ipfs-http-client";
import { useBackendStore } from "./BackendStore";
import { registerModuleHMR } from ".";

export const useIpfsStore = defineStore({
  id: "IpfsStore",
  state: () => ({
    gateway: "https://scripta-beta.infura-ipfs.io/ipfs/",
    client: create({
      url: `${useBackendStore().apiUrl}ipfs`
    })
  }),
  actions: {
    /**
     * Upload generif content to IPFS
     * @param content string of the post content to upload
     * @returns CID of the uploaded content, empty string otherwise
    */
    async uploadPost (content: string): Promise<string> {
      try {
        return (await this.client.add(content)).path;
      } catch (e) {
        return "";
      }
    },
    async uploadFile (content: File): Promise<string> {
      try {
        return (await this.client.add(content)).path;
      } catch (e) {
        return "";
      }
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useIpfsStore);
