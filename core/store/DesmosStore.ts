/* import { DesmosMainnet } from "@desmoslabs/desmjs"; */
import { DesmosTestnet } from "@desmoslabs/desmjs-keplr";
import { defineStore } from "pinia";
import { useBackendStore } from "./BackendStore";
import { registerModuleHMR } from ".";

const chainInfo = DesmosTestnet;

export const useDesmosStore = defineStore({
  id: "DesmosStore",
  state: () => ({
    chainInfo,
    rpc: "https://rpc-testnet.go-find.me/",
    lcd: "https://lcd-testnet.go-find.me/",
    explorer: "https://morpheus.desmos.network/",
    coinDenom: chainInfo.currencies[chainInfo.currencies.length - 1].coinDenom,
    ucoinDenom: chainInfo.currencies[0].coinMinimalDenom,
    subspaceId: 8,
    // eslint-disable-next-line prefer-regex-literals
    usernameRegexp: new RegExp("^[A-Za-z0-9_]{6,30}$"),
    defaultFee: {
      amount: [{
        amount: "1000",
        denom: chainInfo.currencies[0].coinMinimalDenom
      }],
      gas: "300000"
    },
    desmosPrice: 0
  }),
  actions: {
    async updateDesmosPrice () {
      this.desmosPrice = (await (await useBackendStore().fetch("https://api.coingecko.com/api/v3/simple/price?ids=desmos&vs_currencies=usd", "GET", {})).json() as any).desmos.usd;
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useDesmosStore);
