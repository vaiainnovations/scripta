import { defineStore } from "pinia";
import { registerModuleHMR } from ".";

export const useConfigStore = defineStore({
  id: "ConfigStore",
  state: () => ({
    isBetaVersion: useRuntimeConfig().public.isBetaVersion,
    restApiUrl: useRuntimeConfig().public.restApiUrl,
    rpcUrl: useRuntimeConfig().public.rpcUrl,
    lcdUrl: useRuntimeConfig().public.lcdUrl
  }),
  actions: {
  }
});

// Register the store to enable HMR
registerModuleHMR(useConfigStore);
