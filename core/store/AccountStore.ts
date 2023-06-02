import { defineStore } from "pinia";
import { EncodeObject } from "@cosmjs/proto-signing";
import { MsgRevoke } from "cosmjs-types/cosmos/authz/v1beta1/tx";
import { Profile } from "@desmoslabs/desmjs-types/desmos/profiles/v3/models_profile";
import { generateUsername } from "unique-username-generator";
import { registerModuleHMR } from "~~/core/store";
import { useBackendStore } from "~~/core/store/BackendStore";
import { usePostStore } from "~~/core/store//PostStore";
import { useConfigStore } from "~~/core/store//ConfigStore";

export interface MsgRevokeEncodeObject extends EncodeObject {
  typeUrl: "/cosmos.authz.v1beta1.MsgRevoke";
  readonly value: MsgRevoke;
}

export const useAccountStore = defineStore({
  id: "AccountStore",
  state: () => ({
    address: "",
    profile: null as any,
    balance: 0,
    isNewProfile: false,
    sectionId: 0,
    settings: {
      hasAcceptedPrivacy: true,
      hasAcceptedAdvertisement: false,
      hasAcceptedCookies: false
    },
    authz: {
      DEFAULT_SUBSPACE_AUTHORIZATIONS: ["/desmos.posts.v3.MsgCreatePost", "/desmos.posts.v3.MsgEditPost", "/desmos.posts.v3.MsgDeletePost", "/desmos.reactions.v1.MsgRemoveReaction", "/desmos.reactions.v1.MsgAddReaction", "/desmos.reports.v1.MsgCreateReport"],
      DEFAULT_GENERIC_AUTHORIZATIONS: ["/desmos.profiles.v3.MsgSaveProfile"],
      hasAuthz: false,
      grantExpiration: null as Date || null,
      grantGrantee: ""
    }
  }),
  getters: {
  },
  actions: {
    async init () {
      const { $useAuth, $useWallet } = useNuxtApp();

      if ($useAuth().storeAuthAccount === null) {
        return;
      }

      useAccountStore().address = $useAuth().storeAuthAccount!.address; // set the address in the account store
      await useAccountStore().getUserInfo(); // update auth info (authz, etc) from the backend

      // Retrieve the Desmos profile, if exists
      const profile = await (await $useWallet().wallet.client).getProfile(this.address); // can use the wallet client since works also with the noop

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

      await useAccountStore().updateUserAccount();
    },
    /**
     * Update User account
     */
    async updateUserAccount () {
      await this.updateBalance();
      await usePostStore().updateUserPosts();
      useNuxtApp().$useReward().updateUserRewardsHistory();
    },
    /**
     * Update the DSM account balance
     */
    async updateBalance () {
      const { $useWallet, $useDesmosNetwork } = useNuxtApp();
      const balance = await (await $useWallet().wallet.client).getBalance(this.address, $useDesmosNetwork().ucoinDenom);

      // update the store
      this.balance = Number(balance.amount) / 1_000_000;
    },
    async getUserSection (forceCreateSection = false): Promise<any> {
      try {
        const res = await (await useBackendStore().fetch(`${useBackendStore().apiUrl}user/get/${this.address}`, "POST", {
          "Content-Type": "application/json"
        }, JSON.stringify({
          forceCreateSection
        }))).json() as any; // TODO: wrap response as type/obj
        if (res) {
          this.sectionId = Number(res.sectionId || -10);
        }
        console.log(res);
      } catch (e) {
        console.log(e);
      }
    },
    async getUserInfo () {
      try {
        const res = await (await useBackendStore().fetch(`${useBackendStore().apiUrl}user/${this.address}`, "GET", {})).json() as any;
        if (res) {
          this.sectionId = Number(res.sectionId);
          this.settings.hasAcceptedCookies = res.privacyTracking;
          this.settings.hasAcceptedAdvertisement = res.privacyNotifications;
          this.authz.grantExpiration = (res?.grantExpiration) ? new Date(res?.grantExpiration) : null;
          this.authz.grantGrantee = res?.grantGrantee || "";
          try {
            if (new Date(res?.grantExpiration) > new Date(Date.now())) {
              this.authz.hasAuthz = true;
            } else {
              this.authz.hasAuthz = false;
            }
          } catch (e) {}
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useAccountStore);
