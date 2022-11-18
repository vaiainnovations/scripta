import { defineStore } from "pinia";
import { useAccountStore } from "./AccountStore";
import { useConfigStore } from "./ConfigStore";
import { registerModuleHMR } from ".";

export const useBackendStore = defineStore({
  id: "BackendStore",
  state: () => ({
    apiUrl: useConfigStore().restApiUrl
  }),
  getters: {

  },
  actions: {
    fetch (url: string, method: "GET" | "POST" | "PUT" | "DELETE", headersRaw: HeadersInit, body = ""): Promise<Response> {
      const headers = new Headers(headersRaw);

      // if is a client and is logged, set authorization and accountNumber (as an) headers
      if (process.client) {
        const { $useAuth } = useNuxtApp();
        const authStorage = $useAuth().getAuthStorageAccount(useAccountStore().address);

        if (authStorage) {
          if (authStorage.authorization) {
            headers.append("Authorization", authStorage.authorization);
          }
          if (authStorage.accountNumber) {
            headers.append("an", authStorage.accountNumber.toString());
          } else if (authStorage.authorization) {
            headers.append("an", "0");
          }
        }
      }

      return fetch(url, {
        method,
        headers,
        body: body || undefined
      });
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useBackendStore);
