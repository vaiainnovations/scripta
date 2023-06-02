import { defineStore } from "pinia";
import { registerModuleHMR } from "~~/core/store";

export const useConfigStore = defineStore({
  id: "ConfigStore",
  state: () => ({
    version: useRuntimeConfig().public.version,
    restApiUrl: useRuntimeConfig().public.restApiUrl,
    rpcUrl: useRuntimeConfig().public.rpcUrl,
    lcdUrl: useRuntimeConfig().public.lcdUrl,
    subspaceId: useRuntimeConfig().public.subspaceId,
    ipfsGateway: useRuntimeConfig().public.ipfsGateway,
    ipfsGatewayRead: useRuntimeConfig().public.ipfsGatewayRead,
    chainId: useRuntimeConfig().public.chainId,
    web3AuthClientId: useRuntimeConfig().public.web3AuthClientId,
    walletConnectProjectId: useRuntimeConfig().public.walletConnectProjectId,
    gitHash: useRuntimeConfig().public.gitHash
  }),
  actions: {
  }
});

// Register the store to enable HMR
registerModuleHMR(useConfigStore);
