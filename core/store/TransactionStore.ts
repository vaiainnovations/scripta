/* eslint-disable no-unused-vars */
import { defineStore } from "pinia";
import { EncodeObject } from "@cosmjs/proto-signing";
import { registerModuleHMR } from ".";

export enum QueueStatus {
  WAITING = "waiting",
  SIGNING = "signing",
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed"
}

export const useTransactionStore = defineStore({
  id: "TransactionStore",
  state: () => ({
    queue: [] as EncodeObject[],
    status: QueueStatus.WAITING
  }),
  actions: {
    push (message: EncodeObject): void {
      // check if the draft is not empty
      // TODO: add controls to prevent pushing same message twice, and same operations (ex. 2 profile updates)
      this.queue.push(message);
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useTransactionStore);
