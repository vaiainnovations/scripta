import { defineStore } from "pinia";
import { DesmosMainnet, DesmosTestnet } from "@desmoslabs/desmjs";
import { useConfigStore } from "./ConfigStore";
import { useBackendStore } from "./BackendStore";
import { registerModuleHMR } from ".";

let chainInfo = DesmosTestnet;

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
    chainInfo,
    explorer: "https://explorer.desmos.network/",
    coinDenom: chainInfo.currencies[chainInfo.currencies.length - 1].coinDenom,
    ucoinDenom: chainInfo.currencies[0].coinMinimalDenom,
    subspaceId: useConfigStore().subspaceId,
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
    async init () {
      try {
        await this.updateChainStatus();
        if (useConfigStore().isBetaVersion) {
          chainInfo = DesmosTestnet;
        }
      } catch (e) {
        // TODO: Handle error
      }
    },
    async updateChainStatus (): Promise<void> {
      this.chainStatus = (await (await fetch(`${useConfigStore().rpcUrl}/status`)).json() as any).result as ChainStatus;
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
