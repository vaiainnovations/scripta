import * as DesmjsKeplr from "@desmoslabs/desmjs-keplr";
import { useKeplrStore } from "~~/core/store/wallet/KeplrStore";
import { useWalletConnectStore } from "~~/core/store/wallet/WalletConnectStore";
import { useTransactionStore } from "~~/core/store/TransactionStore";
import { useWalletStore } from "~~/core/store/wallet/WalletStore";
import { useDesmosStore } from "~~/core/store/DesmosStore";
import { useWeb3AuthStore } from "~~/core/store/wallet/Web3AuthStore";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      useDesmosNetwork: () => useDesmosStore(),
      useWallet: () => useWalletStore(),
      useWalletConnect: () => useWalletConnectStore(),
      useKeplr: () => useKeplrStore(),
      useWeb3Auth: () => useWeb3AuthStore(),
      useTransaction: () => useTransactionStore(),
      DesmjsKeplr
    }
  };
});
