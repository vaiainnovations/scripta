
import { Buffer } from "buffer";
import { MsgGrantEncodeObject, MsgRevokeEncodeObject } from "@desmoslabs/desmjs";
import { GenericSubspaceAuthorization } from "@desmoslabs/desmjs-types/desmos/subspaces/v3/authz/authz";
import { Timestamp } from "cosmjs-types/google/protobuf/timestamp";
import { GenericAuthorization } from "cosmjs-types/cosmos/authz/v1beta1/authz";
import { defineStore } from "pinia";
import { generateUsername } from "unique-username-generator";
import { decodeTxRaw } from "@cosmjs/proto-signing";
import { Profile } from "@desmoslabs/desmjs-types/desmos/profiles/v3/models_profile";
import { usePostStore } from "./PostStore";
import { SupportedSigner } from "./wallet/SupportedSigner";
import { useAccountStore } from "./AccountStore";
import { useBackendStore } from "./BackendStore";
import { useDesmosStore } from "./DesmosStore";
import { useConfigStore } from "./ConfigStore";
import { registerModuleHMR } from ".";

export enum AuthLevel {
  None = "none",
  Memory = "memory",
  Wallet = "wallet",
  Session = "session",
}

interface StoreAuthAccount {
  address: string,
  signer: SupportedSigner,
  authorization: string,
  accountNumber: number,
}

interface StoredAuthData {
  version: number,
  accounts: StoreAuthAccount[],
  signer: SupportedSigner | null,
}

export class AuthStorage {
  static STORAGE_KEY = "auth";
  static STORAGE_VERSION = 2;

  /**
   * Store locally auth data
   * @param value auth struct
   */
  static set (value: StoreAuthAccount): void {
    let storedAuthData = JSON.parse(localStorage.getItem(AuthStorage.STORAGE_KEY)) as StoredAuthData;
    if (!storedAuthData || !storedAuthData.accounts || storedAuthData.accounts?.length === 0) {
      storedAuthData = { accounts: [value], version: this.STORAGE_VERSION, signer: value.signer };
    } else {
      const index = storedAuthData.accounts.findIndex(account => account.address === value.address);
      if (index >= 0) {
        storedAuthData.accounts[index] = value;
      } else {
        storedAuthData.accounts.push(value);
      }
      storedAuthData.signer = value.signer;
    }
    localStorage.setItem(AuthStorage.STORAGE_KEY, JSON.stringify(storedAuthData));
  }

  /**
   * Retrieve locally stored auth data
   * @param address - address of the account
   */
  static get (address = ""): StoreAuthAccount | null {
    let res = null as StoreAuthAccount | null;
    const storedAuthData = JSON.parse(localStorage.getItem(AuthStorage.STORAGE_KEY)) as StoredAuthData;
    if (storedAuthData && storedAuthData.version === this.STORAGE_VERSION && storedAuthData.accounts && storedAuthData?.accounts?.length > 0) {
      if (address) {
        res = storedAuthData.accounts.find(account => account.address === address) || null;
      } else {
        res = storedAuthData.accounts[0];
      }
    }
    return res;
  }

  /**
   * Delete local stored auth data
   */
  static delete (address = ""): void {
    try {
      if (address) {
        const storedAuthData = JSON.parse(localStorage.getItem(AuthStorage.STORAGE_KEY)) as StoredAuthData;
        storedAuthData.signer = null;
        if (storedAuthData && storedAuthData.version === this.STORAGE_VERSION && storedAuthData.accounts && storedAuthData?.accounts?.length > 0) {
          const index = storedAuthData.accounts.findIndex(account => account.address === address);
          if (index >= 0) {
            storedAuthData.accounts.splice(index, 1);
            localStorage.setItem(AuthStorage.STORAGE_KEY, JSON.stringify(storedAuthData));
          }
        }
      } else {
        localStorage.removeItem(AuthStorage.STORAGE_KEY);
      }
    } catch (e) {
      console.log(e);
    }
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
      const { $useWallet } = useNuxtApp();
      const storedAuth = AuthStorage.get(); // just check if there is any stored auth data
      if (storedAuth) {
        this.authLevel = AuthLevel.Memory;
        if (storedAuth.signer) {
          await $useWallet().retrieveCurrentWallet(storedAuth.signer);
          const storedAuthAccount = AuthStorage.get((await $useWallet().getSigner().getCurrentAccount()).address);
          if (!storedAuthAccount) {
            this.logout("/auth");
          }
          await useAccountStore().getUserInfo();
        }
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
      if (storedAuth && storedAuth.signer) {
        return true;
      }
      return false;
    },
    /**
     * Get the Auth local storage
     * @returns StoredAuthData
     */
    getAuthStorage (): StoredAuthData {
      return JSON.parse(localStorage.getItem(AuthStorage.STORAGE_KEY)) as StoredAuthData;
    },
    /**
     * Get the Auth local storage
     * @returns StoredAuthData
     */
    getAuthStorageAccount (address: string): StoreAuthAccount {
      try {
        const storedAuthData = JSON.parse(localStorage.getItem(AuthStorage.STORAGE_KEY)) as StoredAuthData;
        // if not supported AuthStorage version, delete
        if (storedAuthData.version !== AuthStorage.STORAGE_VERSION) {
          AuthStorage.delete();
        }
        return storedAuthData.accounts.find(account => account.address === address);
      } catch (e) {
      }
      return null;
    },
    /**
     * Check if the user has a valid authorization
     * @returns true if the authorization is valid
     */
    hasValidAuthAuthorization (): boolean {
      const authStorage = AuthStorage.get(useAccountStore().address);

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
      const { $useWallet } = useNuxtApp();
      AuthStorage.delete(useAccountStore().address);
      try {
        await $useWallet().disconnect(); // disconnect the wallet (signer and client)
      } catch (e) {
        // nothig, probably already disconnected
      }
      useAccountStore().$reset();
      useAuthStore().$reset();
      $useWallet().$reset();
      localStorage.removeItem("walletconnect");
      if (route) {
        await navigateTo(route);
      }
    },
    /**
     * Sign in
     */
    async login (force = false): Promise<void> {
      const { $useWallet } = useNuxtApp();
      // prevent from multiple login attempts if the user is already logged in, unless forced (ex. Keplr wallet switch)
      if (this.authLevel > AuthLevel.None && !force) {
        return;
      }
      if ($useWallet().signerId !== SupportedSigner.Noop) {
        this.authLevel = AuthLevel.Wallet; // Wallet is connected

        if (useRouter().currentRoute.value.path.includes("auth")) {
          await navigateTo("/auth/loading");
        }

        // Get the user address
        const account = await $useWallet().getSigner().getCurrentAccount();
        useAccountStore().address = account.address;

        // update auth info (authz, etc) from the backend
        await useAccountStore().getUserInfo();

        // Retrieve the Desmos profile, if exists
        const profile = await (await $useWallet().wallet.client).getProfile(account.address);

        if (profile) {
          useAccountStore().profile = profile;
          // if possitble, replace the user's profile picture with the one from the IPFS Read gateway
          try {
            profile.pictures!.profile = profile.pictures!.profile.replace(useConfigStore().ipfsGateway, useConfigStore().ipfsGatewayRead);
          } catch (e) { /* ignore */ }
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

        await useAccountStore().updateBalance();

        usePostStore().updateUserPosts();

        // Route to the profile page only if coming from auth
        if (useRouter().currentRoute.value.path.includes("auth")) {
          await navigateTo("/auth/session");
        }

        if (!this.hasValidAuthAuthorization()) {
          // If the authorization is expired, request a new one
          await navigateTo("/auth/session");
        }
      }
    },

    async authorize (): Promise<boolean> {
      const { $useTransaction, $useWallet } = useNuxtApp();
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
                denom: useDesmosStore().ucoinDenom,
                amount: "0"
              }
            ]
          },
          0
        );
        const address = (await $useWallet().getSigner().getCurrentAccount()).address;
        const token = Buffer.from(signedBytes).toString("base64");// Store the auth data locally
        const accountInfo = await (await $useWallet().wallet.client).getAccount(address).catch(() => { return null; });
        const storedAuthAccount: StoreAuthAccount = {
          address,
          signer: $useWallet().signerId,
          authorization: token,
          accountNumber: accountInfo?.accountNumber || 0
        };
        AuthStorage.set(storedAuthAccount);
        await useAccountStore().getUserInfo();
        return true;
      } catch (e) {
        console.log(e);
      }
      return false;
    },
    async getAuthzConfig (): Promise<{
      grantee: string
    } | null> {
      let authzConfig: {
        grantee: string
      } | null = null;
      try {
        authzConfig = await (await useBackendStore().fetch(`${useBackendStore().apiUrl}authz`, "GET", {
          "Content-Type": "application/json"
        })).json();
      } catch (e) {
        console.log(e);
      }
      return authzConfig;
    },
    async grantAuthorizations () {
      const { $useTransaction, $useDesmosNetwork } = useNuxtApp();
      const grants = [] as MsgGrantEncodeObject[];
      const authorizations = [] as {typeUrl: string, value: Uint8Array}[];
      await useAccountStore().getUserInfo();

      const authzConfig = await this.getAuthzConfig();
      $useTransaction().assertBalance("/settings");

      // Create Subspace authorizations
      useAccountStore();

      // Generate Subspace authorizations
      useAccountStore().authz.DEFAULT_SUBSPACE_AUTHORIZATIONS.forEach((authorization) => {
        authorizations.push(
          {
            typeUrl: "/desmos.subspaces.v3.authz.GenericSubspaceAuthorization",
            value: GenericSubspaceAuthorization.encode({
              subspacesIds: [useConfigStore().subspaceId],
              msg: authorization
            }).finish()
          });
      });

      // Generate Generica authorizations
      useAccountStore().authz.DEFAULT_GENERIC_AUTHORIZATIONS.forEach((authorization) => {
        authorizations.push(
          {
            typeUrl: "/cosmos.authz.v1beta1.GenericAuthorization",
            value: GenericAuthorization.encode(GenericAuthorization.fromPartial({
              msg: authorization
            })).finish()
          });
      });

      authorizations.forEach((authorization) => {
        grants.push({
          typeUrl: "/cosmos.authz.v1beta1.MsgGrant",
          value: {
            grantee: authzConfig.grantee,
            granter: useAccountStore().address,
            grant: {
              authorization,
              expiration: Timestamp.fromPartial({
                nanos: 0,
                seconds: (+new Date() / 1000) + 60 * 60 * 24 * 7 // + 7 days
              })
            }
          }
        }
        );
      });
      const signed = await $useTransaction().directSign(grants, "Signed from Scripta", $useDesmosNetwork().defaultFee, 1);
      if (!signed) {
        return false;
      }

      try {
        const res = (await (
          await useBackendStore().fetch(
            `${useBackendStore().apiUrl}authz`,
            "POST",
            {
              "Content-Type": "application/json"
            },
            JSON.stringify({
              grant: Buffer.from(signed).toString("base64")
            })
          )
        ).json()) as any; // TODO: wrap response as type/obj
        console.log(res);
      } catch (e) {
        return false;
      }
      return true;
    },
    async revokeAuthorizations (): Promise<boolean> {
      const { $useTransaction, $useDesmosNetwork } = useNuxtApp();
      $useTransaction().assertBalance("/settings");
      const revokes = [] as MsgRevokeEncodeObject[];
      const authorizations = [...useAccountStore().authz.DEFAULT_GENERIC_AUTHORIZATIONS, ...useAccountStore().authz.DEFAULT_SUBSPACE_AUTHORIZATIONS];
      authorizations.forEach((revokeType) => {
        revokes.push({
          typeUrl: "/cosmos.authz.v1beta1.MsgRevoke",
          value: {
            granter: useAccountStore().address,
            grantee: useAccountStore().authz.grantGrantee,
            msgTypeUrl: revokeType
          }
        });
      });
      const signed = await $useTransaction().directSign(revokes, "Signed from Scripta", $useDesmosNetwork().defaultFee, 1);

      try {
        (await (
          await useBackendStore().fetch(
            `${useBackendStore().apiUrl}authz/delete`,
            "POST",
            {
              "Content-Type": "application/json"
            },
            JSON.stringify({
              grant: Buffer.from(signed).toString("base64")
            })
          )
        ).json()) as any; // TODO: wrap response as type/obj
      } catch (e) {
        console.log(e);
        return false;
      }
      return true;
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useAuthStore);
