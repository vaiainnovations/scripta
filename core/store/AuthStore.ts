
import { defineStore } from "pinia";
import { SupportedSigner, useWalletStore } from "./wallet/WalletStore";
import { useAccountStore } from "./AccountStore";
import { registerModuleHMR } from ".";

export enum AuthLevel {
  None = "none",
  Memory = "memory",
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
    authLevel: AuthLevel.None,
    authErrorMessage: ""
  }),
  getters: {

  },
  actions: {
    async init (): Promise<void> {
      console.log("called AuthStore init");
      const storedAuth = AuthStorage.get();
      if (storedAuth && storedAuth.version && storedAuth.signer && storedAuth.address) {
        this.authLevel = AuthLevel.Memory;
        await useWalletStore().retrieveCurrentWallet(storedAuth.signer);
        if (this.authLevel !== AuthLevel.None) {
          this.login();
        }
      }
    },
    hasAuthStorage (): boolean {
      const storedAuth = AuthStorage.get();
      if (storedAuth && storedAuth.version && storedAuth.signer && storedAuth.address) {
        return true;
      }
      return false;
    },

    /**
     * Sign out
     * @param route New route after the logout. Don't re-route if omitted
     */
    async logout (route?: string): Promise<void> {
      AuthStorage.delete();
      await useWalletStore().disconnect(); // disconnect the wallet (signer and client)
      useAccountStore().$reset();
      useAuthStore().$reset();
      useWalletStore().$reset();
      localStorage.removeItem("walletconnect");
      console.log("logged out");
      if (route) {
        await navigateTo(route);
      }
    },
    /**
     * Sign in
     */
    async login (): Promise<void> {
      console.log("called login");
      if (useWalletStore().signerId !== SupportedSigner.Noop) {
        this.authLevel = AuthLevel.Wallet; // Wallet is connected

        if (useRouter().currentRoute.value.path.includes("auth")) {
          await navigateTo("/auth/loading");
        }

        // Get the user address
        const account = await useWalletStore().wallet.signer.getCurrentAccount();
        useAccountStore().address = account.address;

        // TODO: Auth Backend call
        /* const authSuccess = false;
        if (!authSuccess) {
          navigateTo("/auth/error");
          return;
        } */

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

        // Route to the profile page only if coming from auth
        if (useRouter().currentRoute.value.path.includes("auth")) {
          console.log("routing to success");
          await navigateTo("/auth/success");
        }
      }
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useAuthStore);
