import { defineStore } from "pinia";
import { DesmosClient, NoOpSigner, Signer, SignerStatus } from "@desmoslabs/desmjs";
import { registerModuleHMR } from "..";
import { useAuthStore } from "../AuthStore";
import { useConfigStore } from "../ConfigStore";
import { useWalletConnectStore } from "./WalletConnectStore";
import { useKeplrStore } from "./KeplrStore";
import { SupportedSigner } from "./SupportedSigner";
import { useWeb3AuthStore } from "./Web3AuthStore";

class Wallet {
  public client = DesmosClient.connectWithSigner(useConfigStore().rpcUrl, new NoOpSigner());
}

let signer = new NoOpSigner() as Signer;
let aminoSigner = new NoOpSigner() as Signer;

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
      case SupportedSigner.Web3Auth:
        await useWeb3AuthStore().connect();
        break;

      default:
        break;
      }
    },

    /**
    * Connect to the wallet with the requested signer
    * @param signer Wallet Signer
    */
    async connect (newSigner: Signer, newAminoSigner: Signer, signerId: SupportedSigner) {
      this.signerId = signerId;
      if (this.signerId !== SupportedSigner.Web3Auth) {
      // update the signer
        signer = newSigner;
        aminoSigner = newAminoSigner;
        try {
          await signer.connect();
          await aminoSigner.connect();
        } catch (e) {
          console.log(e);
        }
      } else {
        // handle Web3Auth signers connections
        // first connect to the Amino Sogner
        aminoSigner = newAminoSigner;
        await aminoSigner.connect();

        signer = aminoSigner;
      }

      // listen for signer status changes
      signer.addStatusListener(async () => {
        await this.onWalletUpdate();
      });

      await this.onWalletUpdate();
    },

    async onWalletUpdate () {
      switch (signer.status) {
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
      const signer = this.getSigner(false);
      // accountStore.reset();

      // create the Desmos Client
      try {
        this.wallet.client = await DesmosClient.connectWithSigner(useConfigStore().rpcUrl, signer);
      } catch (e) {
        console.log(e);
        await authStore.logout("/auth/error");
        // abort if the client fails to connect
        return;
      }
      // get Wallet account
      let account = undefined as any | undefined;
      try {
        account = await signer.getCurrentAccount();
      } catch (e) {
        console.log(e);
        await authStore.logout("/auth/error");
      }

      // if the account does not exists, abort
      if (!account || !account.address) {
        await authStore.logout("/auth/error");
        console.error("Account does not exists");
        return;
      }

      // Start the final step of the login process
      console.log("called WalletStore onWalletConnected");
      try {
        await authStore.login(true);
      } catch (e) {
        console.log(e);
        await authStore.logout("/auth/error");
      }
    },

    async onWalletNotConnected () {
      await this.disconnect();
    },

    /**
    * Disconnect from the wallet
    */
    async disconnect () {
      const signer = this.getSigner();
      if (signer.isConnected) {
        // disconnect the signer
        await signer.disconnect();

        // disconnect the client
        (await this.wallet.client).disconnect();

        this.wallet = {
          wallet: new Wallet(),
          signerId: SupportedSigner.Noop
        };
      }
    },

    getSigner (amino = false): Signer {
      return amino ? aminoSigner as Signer : signer as Signer;
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useWalletStore);
