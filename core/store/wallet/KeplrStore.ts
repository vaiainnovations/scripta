import { SigningMode } from "@desmoslabs/desmjs";
import { defineStore } from "pinia";
import { registerModuleHMR } from "..";
import { useAuthStore } from "../AuthStore";
import { DESMOS_TESTNET_CHAIN_INFO, KeplrSigner } from "./KeplrSigner";
import { SupportedSigner, useWalletStore } from "./WalletStore";

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
    async init (): Promise<void> {
      if (process.client) {
        this.isInstalled = await window.keplr.version !== "";
      }
    },
    /**
    * Initialize Keplr Authentication process
    * Get the Keplr Signer from the window, and connect it to the wallet
    */
    async connect (): Promise<void> {
      if (!window.keplr) {
        return;
      }
      this.isInstalled = true;

      // const chainInfo = (truncateSync) ? DESMOS_TESTNET_CHAIN_INFO : DESMOS_MAINNET_CHAIN_INFO;
      const chainInfo = DESMOS_TESTNET_CHAIN_INFO;

      // Create the Keplr Signer with the currrent configuration
      const keplrSigner = new KeplrSigner(window.keplr!, {
        signingMode: SigningMode.DIRECT,
        preferNoSetFee: true,
        preferNoSetMemo: true,
        chainInfo
      });
      const walletStore = useWalletStore();
      await walletStore.connect(keplrSigner, SupportedSigner.Keplr);

      // If Keplr + Ledger, sign out the user
      const isLedgerKeplrUser = (await window.keplr.getKey("morpheus-apollo-2")).isNanoLedger;
      if (isLedgerKeplrUser) {
        alert("Keplr does not support Desmos when used with a Ledger. You can use the Desmos App with your Ledger instead.");
        await useAuthStore().logout();
        navigateTo("/auth/desmos-app");
      }
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useKeplrStore);
