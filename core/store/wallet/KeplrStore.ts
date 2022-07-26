/* import { SigningMode } from "@desmoslabs/desmjs"; */
import { defineStore } from "pinia";
import { registerModuleHMR } from "..";
import { DESMOS_TESTNET_CHAIN_INFO } from "./KeplrSigner";

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
      const { $useAuth, $useWallet, $KeplrSigner } = useNuxtApp();
      if (!window.keplr) {
        return;
      }
      this.isInstalled = true;

      console.log(useRuntimeConfig().desmos);
      // const chainInfo = (truncateSync) ? DESMOS_TESTNET_CHAIN_INFO : DESMOS_MAINNET_CHAIN_INFO;
      const chainInfo = DESMOS_TESTNET_CHAIN_INFO;

      // If Keplr + Ledger, sign out the user
      const isLedgerKeplrUser = (await window.keplr.getKey("morpheus-apollo-2")).isNanoLedger;
      if (isLedgerKeplrUser) {
        await $useAuth().logout();
        console.log("routing to /auth/error");
        await navigateTo({
          path: "/auth/error"
        });
        return;
      }

      // Create the Keplr Signer with the currrent configuration
      const keplrSigner = new $KeplrSigner(window.keplr!, {
        signingMode: 1,
        preferNoSetFee: true,
        preferNoSetMemo: true,
        chainInfo
      });

      await $useWallet().connect(keplrSigner, "keplr");
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useKeplrStore);
