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
    sectionId: 0
  }),
  getters: {

  },
  actions: {
    async getUserInfo (forceCreateSection = false) {
      try {
        const res = await (await fetch(`${useBackendStore().apiUrl}user/get/${this.address}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            forceCreateSection
          })
        })).json() as any; // TODO: wrap response as type/obj
        if (res) {
          this.sectionId = Number(res.sectionId);
          // TODO: store also the other infos
        }
        console.log(res);
      } catch (e) {
        console.log(e);
      }
    },
    async getUserSection () {
      try {
        const res = await (await fetch(`${useBackendStore().apiUrl}user/get/${this.address}`, { method: "POST" })).json() as any;
        if (res) {
          this.sectionId = Number(res.sectionId);
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useAccountStore);
