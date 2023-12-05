import { defineStore } from "pinia";
import { registerModuleHMR } from "~~/core/store";
import { useBackendStore } from "~~/core/store/BackendStore";

export const useLogStore = defineStore({
  id: "LogStore",
  state: () => ({
  }),
  actions: {
    logOp (data: Record<string, unknown>) {
      try {
        useBackendStore().fetch(`${useBackendStore().apiUrl}op`, "POST", {
          "Content-Type": "application/json"
        }, JSON.stringify(data));
      } catch (e) {
        console.log(e);
      }
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useLogStore);
