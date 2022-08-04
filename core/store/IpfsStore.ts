import { defineStore } from "pinia";
import { create } from "ipfs-http-client";
import { registerModuleHMR } from ".";

export const useIpfsStore = defineStore({
  id: "IpfsStore",
  state: () => ({
    gateway: "https://ipfs.infura.io/ipfs/",
    client: create({ url: "https://ipfs.infura.io:5001" })
  }),
  actions: {
    /**
     * Upload Post content to IPFS
     * @param content string of the post content to upload
     * @returns CID of the uploaded content, empty string otherwise
    */
    async uploadPost (content: string): Promise<string> {
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
