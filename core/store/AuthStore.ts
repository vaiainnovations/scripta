import { defineStore } from "pinia";
import { registerModuleHMR } from ".";

export enum AuthLevel {
    None = "none",
    Wallet = "wallet",
    Authz = "authz",
}

export const useAuthStore = defineStore({
  id: "AuthStore",
  state: () => ({
    authLevel: AuthLevel.None
  }),
  getters: {

  },
  actions: {
  }
});

// Register the store to enable HMR
registerModuleHMR(useAuthStore);
