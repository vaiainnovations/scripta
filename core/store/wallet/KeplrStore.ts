/* import { SigningMode } from "@desmoslabs/desmjs"; */
import { defineStore } from "pinia";
import { registerModuleHMR } from "..";
import { useDesmosStore } from "../DesmosStore";

export const useKeplrStore = defineStore({
  id: "KeplrStore",
  state: () => ({
    isInstalled: false
  }),
  getters: {
  },
  actions: {
    /**
     * Init Keplr & check requirements
     */
    init (): void {
      if (process.client) {
        this.isInstalled = window.keplr && window.keplr.version !== "";
      }
    },
    /**
    * Initialize Keplr Authentication process
    * Get the Keplr Signer from the window, and connect it to the wallet
    */
    async connect (): Promise<void> {
      const { $useWallet, $KeplrSigner } = useNuxtApp();
      const client = window.keplr;
      if (!client) {
        return;
      }
      this.isInstalled = true;

      console.log(useRuntimeConfig().desmos);
      // eslint-disable-next-line no-constant-condition
      const chainInfo = useDesmosStore().chainInfo;

      // Create the Keplr Signer with the currrent configuration
      const keplrAminoSigner = new $KeplrSigner(client, {
        signingMode: 0,
        signOptions: {
          disableBalanceCheck: false,
          preferNoSetFee: false,
          preferNoSetMemo: false
        },
        chainInfo
      });
      console.log(keplrAminoSigner);
      const keplrSigner = new $KeplrSigner(client, {
        signingMode: 1,
        signOptions: {
          disableBalanceCheck: false,
          preferNoSetFee: false,
          preferNoSetMemo: false
        },
        chainInfo
      });

      // If Keplr + Ledger, sign out the user
      /* const isLedgerKeplrUser = (await client.getKey("morpheus-apollo-2")).isNanoLedger;
      if (isLedgerKeplrUser) {
        await $useAuth().logout();
        await navigateTo({
          path: "/auth/desmos-app"
        });
        return;
      } */

      await $useWallet().connect(keplrSigner, keplrAminoSigner, "keplr");
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useKeplrStore);
