import { defineStore } from "pinia";
import { DesmosTestnet, DesmosMainnet } from "@desmoslabs/desmjs";
import { registerModuleHMR } from "~~/core/store";
import { useConfigStore } from "~~/core/store/ConfigStore";
import { useBackendStore } from "~~/core/store/BackendStore";

export interface NodeInfo {
  id: string;
  listen_addr: string;
  network: string;
  version: string;
  channels: string;
  moniker: string;
}

export interface SyncInfo {
  latest_block_hash: string;
  latest_app_hash: string;
  latest_block_height: string;
  latest_block_time: Date;
  earliest_block_hash: string;
  earliest_app_hash: string;
  earliest_block_height: string;
  earliest_block_time: Date;
  catching_up: boolean;
}

export interface ChainStatus {
  node_info: NodeInfo;
  sync_info: SyncInfo;
}

export const useDesmosStore = defineStore({
  id: "DesmosStore",
  state: () => ({
    chainStatus: null as ChainStatus,
    chainInfo: null as any,
    explorer: "https://explorer.desmos.network/",
    coinDenom: "",
    ucoinDenom: "",
    subspaceId: useConfigStore().subspaceId,
    // eslint-disable-next-line prefer-regex-literals
    usernameRegexp: new RegExp("^[A-Za-z0-9_]{6,30}$"),
    defaultFee: {
      amount: [{
        amount: "1000",
        denom: ""
      }],
      gas: "300000"
    },
    desmosPrice: 0
  }),
  actions: {
    init () {
      try {
        switch (useConfigStore().chainId) {
        case "morpheus-apollo-2":
          this.chainInfo = DesmosTestnet;
          break;
        default:
          this.chainInfo = DesmosMainnet;
          break;
        }
        this.coinDenom = this.chainInfo.currencies[this.chainInfo.currencies.length - 1].coinDenom;
        this.ucoinDenom = this.chainInfo.currencies[0].coinMinimalDenom;
        this.defaultFee.amount[0].denom = this.ucoinDenom;
        this.updateChainStatus();
      } catch (e) {
        // TODO: Handle error
      }
    },
    async updateChainStatus (): Promise<void> {
      try {
        this.chainStatus = (await (await fetch(`${useConfigStore().rpcUrl}status`)).json() as any).result as ChainStatus;
      } catch (e) {}
    },
    async updateDesmosPrice () {
      this.desmosPrice = (await (await useBackendStore().fetch("https://api.coingecko.com/api/v3/simple/price?ids=desmos&vs_currencies=usd", "GET", {})).json() as any).desmos.usd;
    }
  },
  getters: {
    chainId (): string {
      return this.chainStatus.node_info.network;
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useDesmosStore);
