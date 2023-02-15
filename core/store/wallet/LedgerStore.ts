import Transport from "@ledgerhq/hw-transport";
import { defineStore } from "pinia";
import TransportWebHID from "@ledgerhq/hw-transport-webhid";
import { stringToPath } from "@cosmjs/crypto";
import { LedgerConnector, LedgerSigner } from "@cosmjs/ledger-amino";
import { OfflineSignerAdapter } from "@desmoslabs/desmjs";
import { registerModuleHMR } from "..";
import { SupportedSigner } from "./SupportedSigner";

export interface LedgerApp {
  id: string;
  name: string;
  hdPath: string;
  icon: string;
  minVersion: string;
}

const supportedLedgerApps: LedgerApp[] = [
  {
    id: "desmos",
    icon: "/brands/desmos/logo.svg",
    hdPath: "m/44'/852'/0'/0/0",
    name: "Desmos",
    minVersion: "2.18.2"
  },
  {
    id: "cosmos",
    icon: "/brands/cosmos/logo.svg",
    hdPath: "m/44'/118'/0'/0/0",
    name: "Cosmos",
    minVersion: "1.5.3"
  }

];

export const useLedgerStore = defineStore({
  id: "LedgerStore",
  state: () => ({
    supportedLedgerApps,
    selectedApp: null as LedgerApp | null,
    isConnected: false,
    transport: null as Transport | null
  }),
  getters: {
  },
  actions: {
    /**
     * Init Ledger & check requirements
     */
    setSelectedApp (app: LedgerApp): void {
      this.selectedApp = app;
    },
    /**
    * Initialize Ledger Authentication process
    * Get the Ledger Signer from the window, and connect it to the wallet
    */
    async connect (): Promise<void> {
      if (!this.selectedApp) {
        throw new Error("No app selected");
      }

      const isSupportedWebHID = await TransportWebHID.isSupported().catch(() => { throw new Error("WebHID not supported"); });
      if (!isSupportedWebHID) {
        throw new Error("WebHID not supported");
      }

      // Connect to Ledger device
      this.transport = await TransportWebHID.create().catch(() => { throw new Error("Transport not created"); });
      if (!this.transport) {
        throw new Error("Transport not created");
      }

      // Handle device disconnection
      this.transport!.on("disconnect", () => {
        throw new Error("Ledger disconnected");
      });

      const options = {
        ledgerAppName: this.selectedApp?.id,
        minLedgerAppVersion: this.selectedApp?.minVersion,
        prefix: "desmos",
        hdPaths: [stringToPath(this.selectedApp!.hdPath)]
      };
      const connector = new LedgerConnector(this.transport!, options);

      let address = "";
      let version = "";

      try {
        address = await connector.getCosmosAddress(); // Get the address from the Ledger
        version = await connector.getCosmosAppVersion();
      } catch (e) {
        throw new Error(`Open the ${this.selectedApp?.name} app on your Ledger (version ${this.selectedApp?.minVersion} or higher)`);
      }

      if (address && version) {
        this.isConnected = true;
        console.log(address);
      }

      const signer = new OfflineSignerAdapter(new LedgerSigner(this.transport, options));

      await useNuxtApp().$useWallet().connect(signer, SupportedSigner.Ledger);
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useLedgerStore);
