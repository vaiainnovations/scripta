import { defineStore } from "pinia";
import { registerModuleHMR } from "..";
import { SupportedSigner } from "./SupportedSigner";

export const useKeplrStore = defineStore({
  id: "KeplrStore",
  state: () => ({
    isInstalled: false, // Keplr extension is installed
    isAvailable: false // Keplr is available
  }),
  getters: {
  },
  actions: {
    /**
     * Init Keplr & check requirements
     */
    async init (): Promise<void> {
      if (process.client) {
        if (window.keplr) { // Check if Keplr is already installed
          this.isInstalled = true;
          this.isAvailable = true;
          return;
        }
        const device = useDevice();
        if (device.isChrome) {
          try {
            await fetch("chrome-extension://dmkamcknogkgcdfhhbddcghachkejeap/injectedScript.bundle.js"); // check if the js bundle is available
            // prevent infinite loop
            if (useRoute().query.refresh !== "false") {
              window.location.href = `${useRoute().fullPath}?refresh=false`; // if it is, the extension is installed, reload the page to load the extension
            }
          } catch (e) {
            console.log("Keplr extension is not installed");
          }
        }
        if (this.isInstalled) {
          this.isAvailable = window.keplr && window.keplr.version !== ""; // check if the Keplr instance is available
        }
      }
    },
    /**
    * Initialize Keplr Authentication process
    * Get the Keplr Signer from the window, and connect it to the wallet
    */
    async connect (): Promise<void> {
      const { $useWallet, $DesmjsKeplr, $useDesmosNetwork, $useAuth } = useNuxtApp();
      const client = window.keplr;
      if (!client) {
        return;
      }
      this.isAvailable = true;

      await $useDesmosNetwork().updateChainStatus();
      const chainInfo = $useDesmosNetwork().chainInfo;
      await $DesmjsKeplr.KeplrSigner.setupChainNetwork(await useNuxtApp().$DesmjsKeplr.setupChainInfo(chainInfo));

      // Create the Keplr Signer with the currrent configuration
      const keplrSigner = new $DesmjsKeplr.KeplrSigner(client, {
        signingMode: 1,
        signOptions: {
          disableBalanceCheck: false,
          preferNoSetFee: false,
          preferNoSetMemo: false
        },
        chainInfo
      });

      // If Keplr + Ledger, sign out the user
      const isLedgerKeplrUser = (await client.getKey($useDesmosNetwork().chainId)).isNanoLedger;
      if (isLedgerKeplrUser) {
        useNuxtApp().$useNotification().error("Keplr Error", "Keplr + Ledger is currently not supported", 10);
        await $useAuth().logout();
        await navigateTo({
          path: "/auth/desmos-app"
        });
        return;
      }

      await $useWallet().connect(keplrSigner, SupportedSigner.Keplr);
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useKeplrStore);
