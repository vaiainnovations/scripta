import { defineStore } from "pinia";
import { Profile } from "@desmoslabs/desmjs-types/desmos/profiles/v3/models_profile";
import { useBackendStore } from "./BackendStore";
import { registerModuleHMR } from ".";

export const useAccountStore = defineStore({
  id: "AccountStore",
  state: () => ({
    address: "",
    profile: null as Profile,
    balance: 0,
    isNewProfile: false,
    sectionId: 0,
    settings: {
      hasAcceptedPrivacy: true,
      hasAcceptedAdvertisement: false,
      hasAcceptedCookies: false,
      hasAuthzAuthorization: false
    },
    authz: {
      wantsAuthz: false,
      grantExpiration: null as Date || null,
      grantGrantee: ""
    }
  }),
  getters: {

  },
  actions: {
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
        console.log(res);
        if (res) {
          this.sectionId = Number(res.sectionId);
          this.authz.grantExpiration = (res?.grantExpiration) ? new Date(res?.grantExpiration) : null;
          this.authz.grantGrantee = res?.grantGrantee || "";
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useAccountStore);
