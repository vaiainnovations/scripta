import { defineStore } from "pinia";
import { DesmosClient, NoOpSigner, Signer, SignerStatus } from "@desmoslabs/desmjs";
import { registerModuleHMR } from "~/core/store";
import { useKeplrStore } from "~~/core/store/wallet/KeplrStore";
import { useLeapStore } from "~~/core/store/wallet/LeapStore";
import { useWalletConnectStore } from "~~/core/store/wallet/WalletConnectStore";
import { useWeb3AuthStore } from "~~/core/store/wallet/Web3AuthStore";
import { useAuthStore } from "~~/core/store/AuthStore";
import { useAccountStore } from "~~/core/store/AccountStore";
import { useConfigStore } from "~~/core/store/ConfigStore";
import { SupportedSigner } from "~~/types/SupportedSigner";

class Wallet {
  public client = DesmosClient.connectWithSigner(useConfigStore().rpcUrl, new NoOpSigner());
}

let signer = new NoOpSigner() as Signer;

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
    async initWalletConnection (id: string) {
      const { $useAuth, $useKeplr, $useWalletConnect, $useWeb3Auth, $useLeap } = useNuxtApp();

      switch (id) {
      case SupportedSigner.Keplr:
        await $useKeplr().connect();
        break;
      case SupportedSigner.WalletConnect:
        await $useWalletConnect().connect();
        break;
      case SupportedSigner.Web3Auth:
        await $useWeb3Auth().connect(true);
        break;
      case SupportedSigner.Leap:
        await $useLeap().connect();
        break;
      }

      await $useAuth().initWalletSession();
      $useAuth().initOfflineSession();
      useRouter().push("/profile");
    },

    /**
     * Wait for the wallet to be activated. Authz users are not required to have a wallet connected
     * @param skipAuthz Skip the authz check (ex. necessary when the user has to sign the authorization)
     */
    async waitWalletActivation (skipAuthz = false) {
      if (useAccountStore().authz.hasAuthz && !skipAuthz) {
        return;
      }
      try {
        await this.retrieveCurrentWallet();
      } catch (e) {
        throw new Error(" Wallet not connected");
      }
    },

    /**
    * Check if there is a wallet connected, and try to reconnect
    */
    async retrieveCurrentWallet () {
      const signerId = this.retrieveSessionSignerId();
      // Attempt to retrieve the client
      switch (signerId) {
      case SupportedSigner.Keplr:
        await useKeplrStore().connect();
        break;
      case SupportedSigner.Leap:
        await useLeapStore().connect();
        break;
      case SupportedSigner.WalletConnect:
        try {
          await useWalletConnectStore().connect(true);
        } catch (e) {
          console.log(e);
          await useWalletConnectStore().connect();
        }
        break;
      case SupportedSigner.Web3Auth:
        await useWeb3AuthStore().connect();
        break;

      default:
        break;
      }
    },
    retrieveSessionSignerId (): SupportedSigner | null {
      const { $useAuth } = useNuxtApp();
      const storedAuthAccount = $useAuth().storeAuthAccount;
      return storedAuthAccount?.signer || null;
    },

    /**
    * Connect to the wallet with the requested signer
    * @param signer Wallet Signer
    */
    async connect (newSigner: Signer, signerId: SupportedSigner) {
      this.signerId = signerId;
      // update the signer
      signer = newSigner;

      try {
        await signer.connect();
      } catch (e) {
        console.log(e);
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
      const signer = this.getSigner();
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
        try {
          await signer.disconnect();
        } catch (e) { }

        // disconnect the client
        try {
          (await this.wallet.client).disconnect();
        } catch (e) { }

        this.wallet = {
          wallet: new Wallet(),
          signerId: SupportedSigner.Noop
        };
      }
    },

    getSigner (): Signer {
      return signer;
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useWalletStore);
