import { SigningMode } from "@desmoslabs/desmjs";
import { QRCodeModal, WalletConnect, WalletConnectSigner } from "@desmoslabs/desmjs-walletconnect";
import { defineStore } from "pinia";
import { registerModuleHMR } from "..";

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
      const { $useWallet } = useNuxtApp();

      // create WalletConnect Signer
      const aminoSigner = new WalletConnectSigner(new WalletConnect({
        bridge: "https://bridge.walletconnect.org",
        qrcodeModal: qr ? QRCodeModal : null
      }), {
        signingMode: SigningMode.AMINO // Direct
      });
      const signer = new WalletConnectSigner(new WalletConnect({
        bridge: "https://bridge.walletconnect.org",
        qrcodeModal: qr ? QRCodeModal : null
      }), {
        signingMode: SigningMode.AMINO // Direct
      });
      await aminoSigner.connect();

      // Connect to the wallet with the WalletConnect signer
      await $useWallet().connect(signer, aminoSigner, "walletconnect");
      return signer;
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useWalletConnectStore);
