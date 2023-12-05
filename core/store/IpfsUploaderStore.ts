import { defineStore } from "pinia";
import { create } from "ipfs-http-client";
import { registerModuleHMR } from "~~/core/store";
import { useConfigStore } from "~~/core/store/ConfigStore";
import { useBackendStore } from "~~/core/store/BackendStore";

export const useIpfsUploaderStore = defineStore({
  id: "IpfsUploaderStore",
  state: () => ({
    gateway: useConfigStore().ipfsGateway,
    gatewayRead: useConfigStore().ipfsGatewayRead,
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
registerModuleHMR(useIpfsUploaderStore);
