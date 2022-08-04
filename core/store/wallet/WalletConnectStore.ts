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
    async connect (qr = false): Promise<WalletConnectSigner> {
      const walletStore = useWalletStore();

      // create WalletConnect Signer
      const signer = new WalletConnectSigner(new WalletConnect({
        bridge: "https://bridge.walletconnect.org",
        qrcodeModal: qr ? QRCodeModal : null
      }), {
        signingMode: SigningMode.AMINO // Direct
      });
      await signer.connect();

      // Connect to the wallet with the WalletConnect signer
      await walletStore.connect(signer, SupportedSigner.WalletConnect);
      return signer;
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useWalletConnectStore);
