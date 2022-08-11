import { defineStore } from "pinia";
import { registerModuleHMR } from ".";

export const useDesmosStore = defineStore({
  id: "DesmosStore",
  state: () => ({
    chainId: "morpheus-apollo-2",
    rpc: "https://rpc-testnet.go-find.me/",
    lcd: "https://lcd-testnet.go-find.me/",
    explorer: "https://morpheus.desmos.network/",
    coinDenom: "daric",
    ucoinDenom: "udaric",
    subspaceId: 8,
    // eslint-disable-next-line prefer-regex-literals
    usernameRegexp: new RegExp("^[A-Za-z0-9_]{6,30}$"),
    defaultFee: {
      amount: [{
        amount: "1000",
        denom: "udaric"
      }],
      gas: "200000"
    }
  })
});

// Register the store to enable HMR
registerModuleHMR(useDesmosStore);
