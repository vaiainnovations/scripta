import { defineStore } from "pinia";
import { registerModuleHMR } from ".";

export const useBackendStore = defineStore({
  id: "BackendStore",
  state: () => ({
    apiUrl: "http://127.0.0.1:4000/v1/"
    // apiUrl: "https://rest-dev.scripta.network/v1/"
  }),
  getters: {

  },
  actions: {
  }
});

// Register the store to enable HMR
registerModuleHMR(useBackendStore);
