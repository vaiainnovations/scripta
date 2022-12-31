import { defineStore } from "pinia";
import { registerModuleHMR } from ".";

export const useConfigStore = defineStore({
  id: "ConfigStore",
  state: () => ({
    restApiUrl: useRuntimeConfig().public.restApiUrl,
    rpcUrl: useRuntimeConfig().public.rpcUrl,
    lcdUrl: useRuntimeConfig().public.lcdUrl,
    subspaceId: useRuntimeConfig().public.subspaceId,
    ipfsGateway: useRuntimeConfig().public.ipfsGateway,
    chainId: useRuntimeConfig().public.chainId
  }),
  actions: {
  }
});

// Register the store to enable HMR
registerModuleHMR(useConfigStore);
