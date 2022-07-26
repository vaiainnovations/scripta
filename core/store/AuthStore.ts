
import { defineStore } from "pinia";
import { generateUsername } from "unique-username-generator";
/* import { Profile } from "@desmoslabs/desmjs-types/desmos/profiles/v2/models_profile"; */
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
    async login (force = false): Promise<void> {
      // prevent from multiple login attempts if the user is already logged in, unless forced (ex. Keplr wallet switch)
      if (this.authLevel > AuthLevel.None && !force) {
        return;
      }
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
        const authInfo = await useAccountStore().getAuthInfo();
        console.log(authInfo);
        /* const authSuccess = false;
        if (!authSuccess) {
          navigateTo("/auth/error");
          return;
        } */

        // Retrieve the Desmos profile, if exists
        const profile = await (await useWalletStore().wallet.client).getProfile(account.address);

        if (profile) {
          useAccountStore().profile = profile;
          useAccountStore().isNewProfile = false;
        }

        if (!profile && (!useAccountStore().isNewProfile)) { // If no profile or if the new profile has been already generated
          useAccountStore().isNewProfile = true;
          // generate a new empty profile with a random username/nickname if the profile does not exists

          // Generate a new valid random username
          let username = "";
          while (!/^[A-Za-z0-9_]+$/.test(username)) {
            username = generateUsername("_", 0, 26).concat("" + Math.floor(Math.random() * 10000).toString());
          }
          // generate the nickname from the username
          const nickname = (username.split("_").map(word => word[0].toUpperCase() + word.slice(1)).join(" ")).replace(/[0-9]/g, "");
          const newProfile/* : Profile */ = {
            dtag: username,
            nickname,
            bio: "",
            pictures: {
              cover: "",
              profile: ""
            },
            creationDate: new Date(Date.now())
          };
          useAccountStore().profile = newProfile;
        }

        // TODO: to consider accounts with no balance
        const balance = await (await useWalletStore().wallet.client).getBalance(account.address, "udaric");

        // TODO: call Backend for authz/grants

        // update the store
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
