import * as DesmjsKeplr from "@desmoslabs/desmjs-keplr";
import * as DesmjsLeap from "~~/core/store/wallet/LeapSigner";
import { useKeplrStore } from "~~/core/store/wallet/KeplrStore";
import { useLeapStore } from "~~/core/store/wallet/LeapStore";
import { useWeb3AuthStore } from "~~/core/store/wallet/Web3AuthStore";
import { useWalletConnectStore } from "~~/core/store/wallet/WalletConnectStore";
import { useTransactionStore } from "~~/core/store/TransactionStore";
import { useWalletStore } from "~~/core/store/wallet/WalletStore";
import { useDesmosStore } from "~~/core/store/DesmosStore";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      useDesmosNetwork: () => useDesmosStore(),
      useWallet: () => useWalletStore(),
      useWalletConnect: () => useWalletConnectStore(),
      useKeplr: () => useKeplrStore(),
      useLeap: () => useLeapStore(),
      useWeb3Auth: () => useWeb3AuthStore(),
      useTransaction: () => useTransactionStore(),
      DesmjsKeplr,
      DesmjsLeap
    }
  };
});
