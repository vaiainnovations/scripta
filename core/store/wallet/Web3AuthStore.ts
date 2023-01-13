import { defineStore } from "pinia";
import { SigningMode, PrivateKeySigner } from "@desmoslabs/desmjs";
import { Web3Auth } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { useConfigStore } from "../ConfigStore";
import { registerModuleHMR } from "..";
import { Web3AuthPrivateKeyProvider } from "./Web3AuthAdapter";

export const useWeb3AuthStore = defineStore({
  id: "Web3AuthStore",
  state: () => ({
    signignMode: SigningMode.AMINO
  }),
  getters: {
  },
  actions: {
    /**
    * Inizialize WalletConenct connection & listeners
    */
    async connect (): Promise<void> {
      const { $useWallet } = useNuxtApp();

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
      web3auth.configureAdapter(openloginAdapter);
      const signerAmino = new Web3AuthPrivateKeyProvider(web3auth, {
        logoutOptions: { cleanup: true }
      });
      const signer = new Web3AuthPrivateKeyProvider(web3auth, {
        logoutOptions: { cleanup: true }
      });

      let web3authSignerAmino = new PrivateKeySigner(signerAmino, SigningMode.AMINO);
      let web3authSigner = new PrivateKeySigner(signer, SigningMode.AMINO);
      if (useNuxtApp().$useAuth().hasAuthStorage()) {
        web3authSignerAmino = new PrivateKeySigner(signerAmino, SigningMode.DIRECT);
        web3authSigner = new PrivateKeySigner(signer, SigningMode.DIRECT);
        this.signignMode = SigningMode.DIRECT;
      }
      // Connect to the wallet with the Web3Auth signer
      await $useWallet().connect(web3authSigner, web3authSignerAmino, "web3auth");
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useWeb3AuthStore);
