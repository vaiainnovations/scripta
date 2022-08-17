import { defineStore } from "pinia";
import { registerModuleHMR } from ".";

export const useBackendStore = defineStore({
  id: "BackendStore",
  state: () => ({
    apiUrl: "http://127.0.0.1:4000/v1/"
    // apiUrl: "https://rest-dev.scripta.network/v1/"
  }),
  getters: {

  },
  actions: {
    fetch (url: string, method: "GET" | "POST" | "PUT" | "DELETE", headersRaw: HeadersInit, body: string): Promise<Response> {
      const headers = new Headers(headersRaw);

      // if logged, set authorization and accountNumber (as an) headers
      const { $useAuth } = useNuxtApp();
      const authStorage = $useAuth().getAuthStorage();

      if (authStorage) {
        if (authStorage.authorization) {
          headers.append("Authorization", authStorage.authorization);
        }
        if (authStorage.accountNumber) {
          headers.append("an", authStorage.accountNumber.toString());
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
