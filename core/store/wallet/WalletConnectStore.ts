import { SigningMode } from "@desmoslabs/desmjs";
import { QRCodeModal, WalletConnect, WalletConnectSigner } from "@desmoslabs/desmjs-walletconnect";
import { defineStore } from "pinia";
import { registerModuleHMR } from "..";
import { SupportedSigner, useWalletStore } from "./WalletStore";

export const useWalletConnectStore = defineStore({
  id: "WalletConnectStore",
  state: () => ({
  }),
  getters: {
  },
  actions: {
    /**
    * Inizialize WalletConenct connection & listeners
    */
    async connect (): Promise<void> {
      const walletStore = useWalletStore();

      // create WalletConnect Signer
      const signer = new WalletConnectSigner(new WalletConnect({
        bridge: "https://bridge.walletconnect.org",
        qrcodeModal: QRCodeModal
      }), {
        signingMode: SigningMode.DIRECT
      });
      await signer.connect();

      // Connect to the wallet with the WalletConnect signer
      walletStore.connect(signer, SupportedSigner.WalletConnect);
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useWalletConnectStore);
