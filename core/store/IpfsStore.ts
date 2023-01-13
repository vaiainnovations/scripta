import { defineStore } from "pinia";
import { useConfigStore } from "./ConfigStore";
import { registerModuleHMR } from ".";

export const useIpfsStore = defineStore({
  id: "IpfsStore",
  state: () => ({
    gatewayRead: useConfigStore().ipfsGatewayRead
  }),
  actions: {
    /**
     * Resolve IPFS url to CID
     * @param url Complete IPFS url
     * @returns CID or false if not found
     */
    resolveUrlCid (url: string): string | false {
      try {
        const cid = url.split(useConfigStore().ipfsGateway)[1];
        if (cid.length <= 64) {
          return cid;
        }
      } catch (e) {
        // nothing
      }
      return false;
    },
    /**
     * Resolve IPFS url to Gateway url
     * @param url Complete IPFS url
     * @returns Gateway IPFS url or false if not found
     */
    ipfsUrlToGatewayRead (url: string): string | false {
      const cid = this.resolveUrlCid(url);
      if (cid) {
        return `${this.gatewayRead}${cid}`;
      }
      return false;
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useIpfsStore);
