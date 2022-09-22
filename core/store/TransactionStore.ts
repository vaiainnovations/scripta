/* eslint-disable no-unused-vars */
import { Buffer } from "buffer";
import { defineStore } from "pinia";
import { EncodeObject } from "@cosmjs/proto-signing";
import { StdFee } from "@cosmjs/stargate";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { Signer } from "@desmoslabs/desmjs";
import { useAccountStore } from "./AccountStore";
import { useBackendStore } from "./BackendStore";
import { useDesmosStore } from "./DesmosStore";
import { useWalletStore } from "./wallet/WalletStore";
import { registerModuleHMR } from ".";

export enum QueueStatus {
  WAITING = "waiting",
  SIGNING = "signing",
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed"
}

interface TransactionQueueMsg {
  message: EncodeObject;
  details: Record<string, unknown>;
}

export const useTransactionStore = defineStore({
  id: "TransactionStore",
  state: () => ({
    queue: [] as TransactionQueueMsg[],
    status: QueueStatus.WAITING,
    errorText: "",
    hash: ""
  }),
  actions: {
    push (message: EncodeObject, details: Record<string, unknown> = {}): void {
      if (!useAccountStore().address) {
        useRouter().push("/auth");
        return;
      }

      // TODO: add controls to prevent pushing same message twice, and same operations (ex. 2 profile updates, works but is not ideal)
      if (this.status === QueueStatus.FAILED) {
        this.$reset();
      }
      this.queue.push({ message, details });
    },
    async execute (): Promise<Uint8Array> {
      const { $useWallet } = useNuxtApp();
      // check if the draft is not empty
      try {
        this.status = QueueStatus.SIGNING;
        const client = (await $useWallet().wallet.client);
        const address = useAccountStore().address;
        const defaultFee: StdFee = {
          amount: [{
            amount: "1000",
            denom: "udaric"
          }],
          gas: "200000"
        };

        // sign the messages
        const msgs = (this.queue as TransactionQueueMsg[]).map((el: TransactionQueueMsg) => el.message);
        const details = (this.queue as TransactionQueueMsg[]).map((el: TransactionQueueMsg) => el.details);

        let txBytes: Uint8Array = null;
        if (!useAccountStore().authz.hasAuthz) {
          const signed = await client.sign(address, msgs, defaultFee, "Signed from Scripta.network");
          txBytes = TxRaw.encode(signed).finish();
          console.log(Buffer.from(txBytes).toString("base64"));
        }

        // broadcast the messages
        this.status = QueueStatus.PENDING;
        // const broadcastResult = await client.broadcastTx(txBytes, 10000, 2000);

        let broadcastResult = null as any;
        try {
          broadcastResult = await (await useBackendStore().fetch(`${useBackendStore().apiUrl}/broadcast`, "POST", {
            "Content-Type": "application/json"
          }, JSON.stringify({
            signedMsgs: txBytes ? Buffer.from(txBytes).toString("base64") : null,
            detailedMsgs: details
          }))).json();
        } catch (e) {
          console.log(e);
        }
        console.log(broadcastResult);

        // parse the result
        if (!broadcastResult?.transactionHash) {
          this.status = QueueStatus.FAILED;
          this.errorText = `${broadcastResult.rawLog}`;
          this.hash = broadcastResult.transactionHash;
          // this.resetQueueWithTimer(8);
        } else {
          this.status = QueueStatus.SUCCESS;
          this.resetQueueWithTimer(5, true);
        }
        this.hash = broadcastResult.transactionHash;
        return txBytes;
        // TODO: ask for a profile refresh
      } catch (e) {
        this.status = QueueStatus.FAILED;
        this.errorText = `${e}`;
        this.resetQueueWithTimer(10, true);
      }
    },
    /**
     * Sign and broadcast messages directy avoiding the queue
     * @param messages Encoded messages to sign and broadcast
     * @param details Custom details to be sent to the backend
     * @returns success boolean
     */
    async directTx (messages: EncodeObject[], details: Record<string, unknown>[] = []): Promise<boolean> {
      try {
        let signedBytes = new Uint8Array();
        this.status = QueueStatus.SIGNING;
        if (!useAccountStore().authz.hasAuthz) {
          signedBytes = await this.directSign(messages, "Signed from Scripta.network", useDesmosStore().defaultFee, useWalletStore().wallet.signer.signingMode);
        }

        let broadcastResult = null as any;
        try {
          broadcastResult = await (await useBackendStore().fetch(`${useBackendStore().apiUrl}broadcast`, "POST", {
            "Content-Type": "application/json"
          }, JSON.stringify({
            signedMsgs: signedBytes ? Buffer.from(signedBytes).toString("base64") : null,
            detailedMsgs: details
          }))).json();
        } catch (e) {
          console.log(e);
        }
        this.hash = broadcastResult.transactionHash;
        return broadcastResult?.transactionHash || false;
      } catch (e) {
        // handle tx error or wallet signing rejection
        console.log(e);
        return false;
      }
    },
    /**
     * Sign messages directy avoiding the queue and authz
     * @param messages Encoded messages to sign
     * @param memo Tx memo
     * @param fees Tx fees
     * @param signMode Tx sign mode
     * @returns signed bytes
     */
    async directSign (messages: EncodeObject[], memo = "Signed from Scripta.network", fees = useDesmosStore().defaultFee, signMode: 0 | 1 = 0): Promise<Uint8Array> {
      const { $useWallet } = useNuxtApp();
      // check if the draft is not empty
      try {
        this.status = QueueStatus.SIGNING;
        const client = await $useWallet().wallet.client;
        client.setSigner(signMode === 0 ? $useWallet().wallet.aminoSigner as Signer : $useWallet().wallet.signer as Signer);
        // client.setSigner($useWallet().wallet.signer as Signer);
        const address = useAccountStore().address;
        const accountInfo = await client.getAccount(address).catch(() => { return null; });
        // sign the messages
        const signed = await client.sign(address, messages, fees, memo, accountInfo === null
          ? {
            accountNumber: 0,
            chainId: useDesmosStore().chainInfo.chainId,
            sequence: 0
          }
          : null);
        const txBytes = TxRaw.encode(signed).finish();

        // broadcast the messages
        this.status = QueueStatus.SUCCESS;
        this.resetQueueWithTimer(0);
        return txBytes;
      } catch (e) {
        console.log(e);
        this.status = QueueStatus.FAILED;
        this.errorText = `${e}`;
        this.resetQueueWithTimer(10);
      }
    },
    resetQueueWithTimer (s: number, reset = false): void {
      setTimeout(() => {
        if (reset) {
          this.$reset();
        } else {
          this.status = QueueStatus.WAITING;
          this.hash = "";
          this.hash = "";
        }
        console.log("TransactionModule reset");
      }, s * 1000);
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useTransactionStore);
