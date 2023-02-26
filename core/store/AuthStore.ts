
import { Buffer } from "buffer";
import { MsgGrantEncodeObject, MsgRevokeEncodeObject } from "@desmoslabs/desmjs";
import { GenericSubspaceAuthorization } from "@desmoslabs/desmjs-types/desmos/subspaces/v3/authz/authz";
import { Timestamp } from "cosmjs-types/google/protobuf/timestamp";
import { GenericAuthorization } from "cosmjs-types/cosmos/authz/v1beta1/authz";
import { defineStore } from "pinia";
import { generateUsername } from "unique-username-generator";
import { decodeTxRaw } from "@cosmjs/proto-signing";
import { Profile } from "@desmoslabs/desmjs-types/desmos/profiles/v3/models_profile";
import { SupportedSigner } from "../../types/SupportedSigner";
import { AuthStorage, StoreAuthAccount } from "../../types/AuthStorage";
import { useAccountStore } from "./AccountStore";
import { useBackendStore } from "./BackendStore";
import { useDesmosStore } from "./DesmosStore";
import { useConfigStore } from "./ConfigStore";
import { registerModuleHMR } from ".";

export enum AuthLevel {
  None = -1, // unauthenticated user
  Session = 1, // authenticated user with a stored account & session
  Wallet = 2, // authenticated user with a stored account & session and a fast wallet connected
}

/**
 * Store used to manage the authentication status
 */
export const useAuthStore = defineStore({
  id: "AuthStore",
  state: () => ({
    authLevel: AuthLevel.None,
    authErrorMessage: "",
    storeAuthAccount: null as StoreAuthAccount | null
  }),
  getters: {

  },
  actions: {
    /**
     * Initializes the auth store by checking if there is a stored auth and if it is still valid.
     * It sets the AuthLevel accordingly if the stored auth is still valid.
     */
    init () {
      AuthStorage.migrate();
      this.storeAuthAccount = AuthStorage.getBySessionIndex();

      // If there is no stored auth, there is nothing to do
      if (this.storeAuthAccount == null) {
        return;
      }

      useAccountStore().init();

      // If there is a stored auth, check if it is still valid
      if (this.hasValidAuthAuthorization()) {
        this.authLevel = AuthLevel.Session;
      } else {
        useRouter().push("/auth/session");
        return;
      }
      // TODO: consider a more appropriate location to handle this
      // if the signer is one of the given ones, set the auth level to wallet since can interact directly with the wallet without delays
      if (["keplr", "web3auth"].includes(this.storeAuthAccount.signer)) {
        this.authLevel = AuthLevel.Wallet;
      }
    },
    /**
     * Check if the user has a valid authorization
     * @returns true if the authorization is valid
     */
    hasValidAuthAuthorization (): boolean {
      const authStorage = AuthStorage.getBySessionIndex(); // get the StoredAuthAccount of the current/last session

      if (!authStorage) { // if not found, doesn't have a valid authorization
        return false;
      }

      try {
        const authorization = authStorage.authorization; // get the authorization
        const decoded = decodeTxRaw(Buffer.from(authorization, "base64")); // decode the authorization
        const authorizationExp = JSON.parse(decoded.body.memo).exp; // get the expiration date of the authorization

        // Check if the authorization is expired
        if (+new Date() < authorizationExp) {
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
      AuthStorage.deleteBySessionIndex();
      try {
        await $useWallet().disconnect(); // disconnect the wallet (signer and client)
      } catch (e) {
        // nothing, probably already disconnected
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
      if ($useWallet().signerId === SupportedSigner.Noop) {
        console.log("cannot login, no wallet connected");
      }

      /* if (useRouter().currentRoute.value.path.includes("auth")) {
        await navigateTo("/auth/loading");
      } */

      // Get the user address
      const account = await $useWallet().getSigner().getCurrentAccount();
      if (account === undefined) {
        console.log("cannot login, no wallet connected");
        return;
      }

      const accountData = await (await $useWallet().wallet.client).getAccount(account.address);
      AuthStorage.setAccount({
        address: account.address,
        accountNumber: accountData?.accountNumber || 0,
        authorization: this.storeAuthAccount?.authorization || "",
        signer: $useWallet().signerId
      });

      /* if (!this.hasValidAuthAuthorization() && useRouter().currentRoute.value.path.includes("auth")) {
        // If the authorization is expired, request a new one
        await navigateTo("/auth/session");
      } */
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
        AuthStorage.setAccount(storedAuthAccount);
        await useAccountStore().getUserInfo();
        this.authLevel = AuthLevel.Session;
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

      // Generate MsgGrant expiration time
      let expiration = Timestamp.fromPartial({
        nanos: 0,
        seconds: (+new Date() / 1000) + 60 * 60 * 24 * 14 // + 14 days
      });

      // If the user is using amino encoding, needs another value for the same expiration
      if (useNuxtApp().$useWallet().getSigner().signingMode === 0) {
        expiration = Timestamp.fromPartial({
          nanos: 0,
          seconds: (+new Date()) + 1000 * 60 * 60 * 24 * 14 // + 14 days
        });
      }

      authorizations.forEach((authorization) => {
        grants.push({
          typeUrl: "/cosmos.authz.v1beta1.MsgGrant",
          value: {
            grantee: authzConfig.grantee,
            granter: useAccountStore().address,
            grant: {
              authorization,
              expiration
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
