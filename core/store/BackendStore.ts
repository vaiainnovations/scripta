import { defineStore } from "pinia";
import { registerModuleHMR } from ".";

export const useBackendStore = defineStore({
  id: "BackendStore",
  state: () => ({
    apiUrl: " https://rest-dev.scripta.network/v1/"
  }),
  getters: {

  },
  actions: {
  }
});

// Register the store to enable HMR
registerModuleHMR(useBackendStore);
