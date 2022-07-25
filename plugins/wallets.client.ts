import { useKeplrStore } from "~~/core/store/wallet/KeplrStore";
import { useWalletConnectStore } from "~~/core/store/wallet/WalletConnectStore";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      useWalletConnect: () => useWalletConnectStore(),
      useKeplr: () => useKeplrStore()
    }
  };
});
