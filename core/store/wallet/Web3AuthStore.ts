import { defineStore } from "pinia";
import { SigningMode, PrivateKeySigner } from "@desmoslabs/desmjs";
import { ModalConfig, Web3Auth } from "@web3auth/modal";
import { WALLET_ADAPTERS } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { registerModuleHMR } from "~/core/store";
import { Web3AuthPrivateKeyProvider } from "~~/core/store/wallet/Web3AuthAdapter";
import { useConfigStore } from "~~/core/store/ConfigStore";

export const useWeb3AuthStore = defineStore({
  id: "Web3AuthStore",
  state: () => ({
  }),
  getters: {
  },
  actions: {
    /**
    * Inizialize WalletConenct connection & listeners
    */
    async connect (forceClean = false): Promise<void> {
      const { $useWallet } = useNuxtApp();

      if (forceClean) {
        localStorage.removeItem("openlogin_store");
      }

      const web3authSigner = this.createWeb3AuthClient(SigningMode.DIRECT);

      // Connect to the wallet with the Web3Auth signer
      try {
        await $useWallet().connect(web3authSigner, "web3auth");
      } catch (e) {
        console.log("fail");
      }
    },
    createWeb3AuthClient (signingMode: SigningMode): PrivateKeySigner {
      const web3auth = new Web3Auth({
        authMode: "DAPP",
        clientId: useConfigStore().web3AuthClientId,
        chainConfig: {
          chainNamespace: "other",
          blockExplorer: "https://bigdipper.live/desmos",
          displayName: "Desmos",
          chainId: "desmos-mainnet",
          ticker: "DSM",
          tickerName: "Desmos"
        },
        uiConfig: {
          appLogo: "/logo/logo.svg", // Your App Logo Here
          loginMethodsOrder: ["google", "apple", "twitter", "github", "discord", "twitch", "line", "reddit", "kakao", "linkedin", "weibo", "wechat"],
          theme: "light"
        }
      });

      const openloginAdapter = new OpenloginAdapter({
        adapterSettings: {
          network: "cyan",
          uxMode: "popup",
          whiteLabel: {
            name: "Scripta",
            defaultLanguage: "en",
            dark: false // whether to enable dark mode. defaultValue: false,
          }
        }
      });

      const modalConfig: Record<string, ModalConfig> = {
        [WALLET_ADAPTERS.OPENLOGIN]: {
          label: "openlogin",
          loginMethods: {
          },
          // setting it to false will hide all social login methods from modal.
          showOnModal: true
        }
      };

      web3auth.configureAdapter(openloginAdapter); // Configure the OpenLogin adapter (?)

      const signer = new Web3AuthPrivateKeyProvider(web3auth, {
        logoutOptions: { cleanup: true },
        modalConfig: { ...modalConfig }
      });

      return new PrivateKeySigner(signer, signingMode);
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useWeb3AuthStore);
