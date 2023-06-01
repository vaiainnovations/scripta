import { defineStore } from "pinia";
import { registerModuleHMR } from "..";
import { SupportedSigner } from "../../../types/SupportedSigner";

export const useLeapStore = defineStore({
  id: "LeapStore",
  state: () => ({
    isInstalled: false, // Leap extension is installed
    isAvailable: false // Leap is available
  }),
  getters: {
  },
  actions: {
    /**
     * Init Leap & check requirements
     */
    async init (): Promise<void> {
      if (process.client) {
        if (window.leap) { // Check if Leap is already installed
          this.isInstalled = true;
          this.isAvailable = true;
          return;
        }
        const device = useDevice();
        if (device.isChrome) {
          try {
            await fetch("chrome-extension://fcfcfllfndlomdhbehjjcoimbgofdncg/injectLeap.js"); // check if the js bundle is available
            // prevent infinite loop
            if (useRoute().query.refresh !== "false") {
              window.location.href = `${useRoute().fullPath}?refresh=false`; // if it is, the extension is installed, reload the page to load the extension
            }
          } catch (e) {
            console.log("Leap extension is not installed");
          }
        }
        if (this.isInstalled) {
          this.isAvailable = window.leap && window.leap.version !== ""; // check if the Leap instance is available
        }
      }
    },
    /**
    * Initialize Leap Authentication process
    * Get the Leap Signer from the window, and connect it to the wallet
    */
    async connect (): Promise<void> {
      const { $useWallet, $DesmjsLeap, $useDesmosNetwork, $useAuth, $useNotification } = useNuxtApp();
      const client = window.leap;
      if (!client || client === undefined) {
        $useNotification().error("Leap Locked", "Make sure is installed and unlocked", 10);
        throw new Error("Leap is not available");
      }
      this.isAvailable = true;

      await $useDesmosNetwork().updateChainStatus();
      const chainInfo = $useDesmosNetwork().chainInfo;

      window.addEventListener("leap_keystorechange", () => {
        $useAuth().initWalletSession();
      });

      // Create the Leap Signer with the currrent configuration
      const leapSigner = new $DesmjsLeap.LeapSigner(client, {
        signingMode: 1,
        signOptions: {
          disableBalanceCheck: false,
          preferNoSetFee: false,
          preferNoSetMemo: false
        },
        chainInfo
      });

      await $useWallet().connect(leapSigner, SupportedSigner.Leap);
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useLeapStore);
