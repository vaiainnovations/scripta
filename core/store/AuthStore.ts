import { defineStore } from "pinia";
import { SupportedSigner, useWalletStore } from "./wallet/WalletStore";
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
    /**
     * Sign out
     */
    async logout (): Promise<void> {
      await useWalletStore().disconnect(); // disconnect the wallet (signer and client)
    },
    async login (): Promise<void> {
      if (useWalletStore().signerId !== SupportedSigner.Noop) {
        this.authLevel = await AuthLevel.Wallet; // TODO: remove await
      }
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useAuthStore);
