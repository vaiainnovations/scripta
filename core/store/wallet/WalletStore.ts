import { defineStore } from "pinia";
import { DesmosClient, NoOpSigner, Signer, SignerStatus } from "@desmoslabs/desmjs";
import { registerModuleHMR } from "..";
import { useAuthStore } from "../AuthStore";
import { useWalletConnectStore } from "./WalletConnectStore";
import { useKeplrStore } from "./KeplrStore";

export enum SupportedSigner {
    Noop = "noop",
    WalletConnect = "walletconnect",
    Keplr = "keplr",
}

class Wallet {
  public client = DesmosClient.connectWithSigner("https://rpc.morpheus.desmos.network", new NoOpSigner());
  public signer: Signer = new NoOpSigner();
}

/**
 * Store used to manage the integration with all the different supported Wallets
 */
export const useWalletStore = defineStore({
  id: "WalletStore",
  state: () => ({
    wallet: new Wallet(),
    signerId: SupportedSigner.Noop
  }),
  getters: {
  },
  actions: {

    /**
    * Check if there is a wallet connected, and try to reconnect
    */
    async retrieveCurrentWallet (signerId: string = this.signerId) {
      // Attempt to retrieve the client
      switch (signerId) {
      case SupportedSigner.Keplr:
        await useKeplrStore().connect();
        break;
      case SupportedSigner.WalletConnect:
        await useWalletConnectStore().connect();
        break;

      default:
        break;
      }
    },

    /**
    * Connect to the wallet with the requested signer
    * @param signer Wallet Signer
    */
    async connect (signer: Signer, signerId: SupportedSigner) {
      // update the signer
      this.wallet.signer = signer;
      this.signerId = signerId;

      // connect the signer
      try {
        await this.wallet.signer.connect();
      } catch (e) {
        console.log(e);
      }

      // listen for signer status changes
      this.wallet.signer.addStatusListener(() => {
        this.onWalletUpdate();
      });

      this.onWalletUpdate();
    },

    async onWalletUpdate () {
      switch (this.wallet.signer.status) {
      case SignerStatus.Connected:
        await this.onWalletConnected();
        break;
      case SignerStatus.Connecting:
        break;
      case SignerStatus.Disconnecting:
        break;
      case SignerStatus.NotConnected:
        await this.onWalletNotConnected();
        break;
      }
    },

    /**
    * On Wallet connection success
    */
    async onWalletConnected () {
      // const accountStore = useAccountStore();
      const authStore = useAuthStore();
      // accountStore.reset();

      // create the Desmos Client
      try {
        this.wallet.client = DesmosClient.connectWithSigner("https://rpc.morpheus.desmos.network", this.wallet.signer as Signer);
      } catch (e) {
        console.log(e);
        // abort if the client fails to connect
        return;
      }

      // get Wallet account
      const account = (await this.wallet.signer.getAccounts())[0];

      // if the account does not exists, abort
      if (!account) {
        // return;
      }

      // Start the final step of the login process
      await authStore.login();
    },

    onWalletNotConnected () {
      this.disconnect();
    },

    /**
    * Disconnect from the wallet
    */
    async disconnect () {
      if (this.wallet.signer.isConnected) {
        // disconnect the signer
        await this.wallet.signer.disconnect();

        // disconnect the client
        (await this.wallet.client).disconnect();

        this.wallet = {
          wallet: new Wallet(),
          signerId: SupportedSigner.Noop
        };
      }
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useWalletStore);
