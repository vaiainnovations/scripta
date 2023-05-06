import { AuthWallet } from "./AuthWalletType";

interface SupportedAuthWalletType {
    type: string,
    wallets: AuthWallet[],
  }
  interface SupportedAuthWalletsType {
    default: SupportedAuthWalletType;
    mobile: SupportedAuthWalletType;
  }

export const supportedAuthWallets: SupportedAuthWalletsType = {
  default: {
    type: "",
    wallets: [
      new AuthWallet("web3auth", "Social Login", "svg/wallet/w3a/logo.png", "/auth/w3a", false),
      new AuthWallet("keplr", "Keplr", "svg/wallet/keplr/logo.svg", "/auth/keplr", false)
    ]
  },
  mobile: {
    type: "Mobile",
    wallets: [
      new AuthWallet("dpm", "Desmos App", "svg/wallet/dpm/logo.svg", "/auth/desmos-app", false),
      new AuthWallet("walletconnect", "WalletConnect", "svg/wallet/walletconnect/logo.svg", "/auth/wallet-connect", false)
    ]
  }
};
