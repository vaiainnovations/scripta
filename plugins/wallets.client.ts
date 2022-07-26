import { useKeplrStore } from "~~/core/store/wallet/KeplrStore";
import { useWalletConnectStore } from "~~/core/store/wallet/WalletConnectStore";
import { useWalletStore } from "~~/core/store/wallet/WalletStore";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      useWallet: () => useWalletStore(),
      useWalletConnect: () => useWalletConnectStore(),
      useKeplr: () => useKeplrStore()
    }
  };
});
