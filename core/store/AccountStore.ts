import { defineStore } from "pinia";
import { EncodeObject } from "@cosmjs/proto-signing";
import { MsgRevoke } from "cosmjs-types/cosmos/authz/v1beta1/tx";
/* import { Profile } from "@desmoslabs/desmjs-types/desmos/profiles/v3/models_profile"; */
import { useBackendStore } from "./BackendStore";
import { registerModuleHMR } from ".";

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
      DEFAULT_SUBSPACE_AUTHORIZATIONS: ["/desmos.posts.v2.MsgCreatePost", "/desmos.posts.v2.MsgEditPost", "/desmos.posts.v2.MsgDeletePost", "/desmos.reactions.v1.MsgRemoveReaction", "/desmos.reactions.v1.MsgAddReaction", "/desmos.reports.v1.MsgCreateReport"],
      DEFAULT_GENERIC_AUTHORIZATIONS: ["/desmos.profiles.v3.MsgSaveProfile"],
      hasAuthz: false,
      grantExpiration: null as Date || null,
      grantGrantee: ""
    }
  }),
  getters: {
  },
  actions: {
    /**
     * Update the DSM account balance
     */
    async updateBalance () {
      const { $useWallet, $useDesmosNetwork } = useNuxtApp();
      const balance = await (await $useWallet().wallet.client).getBalance(this.address, $useDesmosNetwork().ucoinDenom);

      // update the store
      this.balance = Number(balance.amount) / 1_000_000;
    },
    async getUserSection (forceCreateSection = false) {
      try {
        const res = await (await useBackendStore().fetch(`${useBackendStore().apiUrl}user/get/${this.address}`, "POST", {
          "Content-Type": "application/json"
        }, JSON.stringify({
          forceCreateSection
        }))).json() as any; // TODO: wrap response as type/obj
        if (res) {
          this.sectionId = Number(res.sectionId);
          // TODO: store also the other infos
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
