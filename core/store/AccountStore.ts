import { defineStore } from "pinia";
import { Profile } from "@desmoslabs/desmjs-types/desmos/profiles/v2/models_profile";
import { registerModuleHMR } from ".";

export const useAccountStore = defineStore({
  id: "AccountStore",
  state: () => ({
    address: "",
    profile: null as Profile,
    balance: 0
  }),
  getters: {

  },
  actions: {
  }
});

// Register the store to enable HMR
registerModuleHMR(useAccountStore);
