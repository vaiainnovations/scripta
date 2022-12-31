import { AuthWallet } from "./AuthWalletType";

interface SupportedAuthWalletType {
    type: string,
    wallets: AuthWallet[],
  }
  interface SupportedAuthWalletsType {
    mobile: SupportedAuthWalletType;
    desktop: SupportedAuthWalletType;
  }

export const supportedAuthWallets: SupportedAuthWalletsType = {
  mobile: {
    type: "Mobile",
    wallets: [
      new AuthWallet("dpm", "Desmos App", "svg/wallet/dpm/logo.svg", "/auth/desmos-app", false),
      new AuthWallet("walletconnect", "WalletConnect", "svg/wallet/walletconnect/logo.svg", "/auth/wallet-connect", false)
    ]
  },
  desktop: {
    type: "Desktop",
    wallets: [
      new AuthWallet("keplr", "Keplr", "svg/wallet/keplr/logo.svg", "/auth/keplr", true)
    ]
  }
};
