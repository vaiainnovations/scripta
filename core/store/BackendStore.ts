import { defineStore } from "pinia";
import { registerModuleHMR } from "~~/core/store";
import { useConfigStore } from "~~/core/store/ConfigStore";

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
        const authStorage = $useAuth().storeAuthAccount;

        // Only if the authorization is valid and verified, append the `Authorization` and `an` flags
        if (authStorage && $useAuth().hasValidAuthAuthorization()) {
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
