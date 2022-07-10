
import { defineStore } from "pinia";
import { SupportedSigner, useWalletStore } from "./wallet/WalletStore";
import { useAccountStore } from "./AccountStore";
import { registerModuleHMR } from ".";

export enum AuthLevel {
    None = "none",
    Local = "local",
    Wallet = "wallet",
    Authz = "authz",
}

interface StoredAuthData {
  version: number,
  address: string,
  signer: SupportedSigner
}

export class AuthStorage {
  static STORAGE_KEY = "auth";

  /**
   * Store locally auth data
   * @param value auth struct
   */
  static set (value: StoredAuthData): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(value));
  }

  /**
   * Retrieve locally stored auth data
   */
  static get (): StoredAuthData {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY));
  }

  /**
   * Delete local stored auth data
   */
  static delete (): void {
    console.log("delete");
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

/**
 * Store used to manage the authentication status
 */
export const useAuthStore = defineStore({
  id: "AuthStore",
  state: () => ({
    authLevel: AuthLevel.None
  }),
  getters: {

  },
  actions: {
    async init (): Promise<void> {
      const storedAuth = AuthStorage.get();
      if (storedAuth && storedAuth.version && storedAuth.signer && storedAuth.address) {
        this.authLevel = AuthLevel.Local;
        await useWalletStore().retrieveCurrentWallet(storedAuth.signer);
        if (this.authLevel !== AuthLevel.None) {
          this.login();
        }
      }
    },

    /**
     * Sign out
     */
    async logout (): Promise<void> {
      AuthStorage.delete();
      await useWalletStore().disconnect(); // disconnect the wallet (signer and client)
      this.authLevel = AuthLevel.None;
      useAccountStore().$reset();
    },
    /**
     * Sign in
     */
    async login (): Promise<void> {
      if (useWalletStore().signerId !== SupportedSigner.Noop) {
        this.authLevel = AuthLevel.Wallet; // Wallet is connected

        // Get the user address
        const account = await useWalletStore().wallet.signer.getCurrentAccount();
        useAccountStore().address = account.address;

        // Retrieve the Desmos profile, if exxists
        const profile = await (await useWalletStore().wallet.client).getProfile(account.address);
        if (!profile) {
          // TODO: to consider accounts without profile
        }

        // TODO: to consider accounts with no balance
        const balance = await (await useWalletStore().wallet.client).getBalance(account.address, "udaric");

        // TODO: call Backend for authz/grants

        // update the store
        useAccountStore().profile = profile;
        useAccountStore().balance = Number(balance.amount) / 1_000_000;

        // Store the auth data locally
        const storedAuthData: StoredAuthData = {
          version: 1,
          address: account.address,
          signer: useWalletStore().signerId
        };
        AuthStorage.set(storedAuthData);

        if (useRouter().currentRoute.value.path.includes("auth")) {
          navigateTo("/auth/success");
        }
      }
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useAuthStore);
