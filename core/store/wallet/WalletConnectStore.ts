import { SigningMode } from "@desmoslabs/desmjs";
import { defineStore } from "pinia";
import { WalletConnectSigner, QRCodeModal, SignClient } from "@desmoslabs/desmjs-walletconnect-v2";
import { registerModuleHMR } from "..";
import { useConfigStore } from "../ConfigStore";
import { useDesmosStore } from "../DesmosStore";

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
    async connect (): Promise<WalletConnectSigner> {
      const { $useWallet } = useNuxtApp();
      const signClient = await SignClient.init({
        projectId: useConfigStore().walletConnectProjectId,
        metadata: {
          name: "Scripta",
          description: "Explore stories, thoughts, and insights on any topics, without having worries about your privacy.",
          url: "https://scripta.network",
          icons: ["https://scripta.network/logo/logo.svg"]
        }
      });
      const signer = new WalletConnectSigner(signClient, {
        // Id of the chain you are connecting to
        chain: `desmos:${useDesmosStore().chainId}`,
        // Signer sign mode
        signingMode: SigningMode.AMINO,
        // Controller used to display the QR Code that can be scanned from a wallet
        qrCodeModalController: QRCodeModal
      });

      // Try to connect to a previous session
      try {
        const sessions = signClient.session.values;
        if (sessions[0]) {
          console.log("Connecting to previous session");
          await signer.connectToSession(sessions[0]);
        }
      } catch (e) { /* no previous session */console.log(e); }

      await $useWallet().connect(signer, "walletconnect");
      return signer;
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useWalletConnectStore);
