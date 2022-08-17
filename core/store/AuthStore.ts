
import { Buffer } from "buffer";
import { defineStore } from "pinia";
import { generateUsername } from "unique-username-generator";
import { decodeTxRaw } from "@cosmjs/proto-signing";
import { Profile } from "@desmoslabs/desmjs-types/desmos/profiles/v3/models_profile";
import { SupportedSigner, useWalletStore } from "./wallet/WalletStore";
import { useAccountStore } from "./AccountStore";
import { registerModuleHMR } from ".";

export enum AuthLevel {
  None = "none",
  Memory = "memory",
  Wallet = "wallet",
  Session = "session",
}

interface StoredAuthData {
  version: number,
  address: string,
  signer: SupportedSigner,
  authorization: string,
  accountNumber: number,
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
    /**
     * Check if there is an auth storage
     * @returns true if there is an auth data stored locally
     */
    hasAuthStorage (): boolean {
      const storedAuth = AuthStorage.get();
      if (storedAuth && storedAuth.version && storedAuth.signer && storedAuth.address) {
        return true;
      }
      return false;
    },
    /**
     * Get the Auth local storage
     * @returns StoredAuthData
     */
    getAuthStorage (): StoredAuthData {
      return AuthStorage.get();
    },
    /**
     * Check if the user has a valid authorization
     * @returns true if the authorization is valid
     */
    hasValidAuthAuthorization (): boolean {
      const authStorage = AuthStorage.get();

      try {
        const authorization = authStorage.authorization;
        const decoded = decodeTxRaw(Buffer.from(authorization, "base64"));
        const authorizationExp = JSON.parse(decoded.body.memo).exp;

        // Check if the authorization is expired
        if (+new Date() < authorizationExp) {
          // TODO: check if the authorization signature is valid?
          return true;
        }

        // Authorization is expired, continue and return false
        console.log("authorization expired");
      } catch (e) {
        // continue, will return false
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

        // TODO: handle error situation

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
          const newProfile: Profile = {
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

        // update the store
        useAccountStore().balance = Number(balance.amount) / 1_000_000;

        // Route to the profile page only if coming from auth
        if (useRouter().currentRoute.value.path.includes("auth")) {
          await navigateTo("/auth/session");
        }
      }
    },

    async authorize (): Promise<boolean> {
      const { $useTransaction } = useNuxtApp();
      let signedBytes = new Uint8Array();
      try {
        signedBytes = await $useTransaction().directSign(
          [],
          JSON.stringify({
            exp: +new Date() + 1000 * 60 * 60 * 24 * 3 // issued by default for 3 days
          }),
          {
            gas: "0",
            amount: [
              {
                denom: "udaric",
                amount: "0"
              }
            ]
          }
        );
        const address = (await useWalletStore().wallet.signer.getCurrentAccount()).address;
        const token = Buffer.from(signedBytes).toString("base64");// Store the auth data locally
        const accountInfo = await (await useWalletStore().wallet.client).getAccount(address).catch(() => { return null; });
        const storedAuthData: StoredAuthData = {
          version: 1,
          address,
          signer: useWalletStore().signerId,
          authorization: token,
          accountNumber: accountInfo?.accountNumber || 0
        };
        AuthStorage.set(storedAuthData);
        return true;
      } catch (e) {
        console.log(e);
      }
      return false;
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useAuthStore);
