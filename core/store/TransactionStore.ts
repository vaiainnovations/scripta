
import { Buffer } from "buffer";
import { defineStore } from "pinia";
import { EncodeObject } from "@cosmjs/proto-signing";
import { StdFee } from "@cosmjs/stargate";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { registerModuleHMR } from "~~/core/store";
import { useAccountStore } from "~~/core/store/AccountStore";
import { useBackendStore } from "~~/core/store/BackendStore";
import { useDesmosStore } from "~~/core/store/DesmosStore";
import { AuthLevel, useAuthStore } from "~~/core/store/AuthStore";

export enum QueueStatus {
  WAITING = "waiting",
  CONNECTING_WALLET = "connecting_wallet",
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
    hash: "",
    isSigning: false
  }),
  actions: {
    /**
     * Push a Tx message inside the queue
     * @param message Tx encoded message
     * @param details Tx BE custom details
     */
    push (message: EncodeObject, details: Record<string, unknown> = {}): void {
      if (!useAccountStore().address) {
        useRouter().push("/auth");
        return;
      }

      if (this.status === QueueStatus.FAILED) {
        this.$reset();
      }

      const duplicatedMsg = this.queue.find(el => JSON.stringify(el.message) === JSON.stringify(message));
      if (duplicatedMsg) {
        return;
      }

      this.assertBalance(); // assert a valid balance to prcess the tx in the future
      this.queue.push({ message, details }); // add the tx to the queue
    },
    /**
     * Execute the transactions inside the queue
     */
    async execute (): Promise<Uint8Array> {
      const { $useWallet } = useNuxtApp();
      this.status = QueueStatus.CONNECTING_WALLET;
      this.isSigning = true;

      try {
        await $useWallet().waitWalletActivation(); // recover the wallet signer & wait for it to be ready
      } catch (error) {
        this.status = QueueStatus.FAILED;
        this.errorText = "Wallet not connected or locked";
        this.resetQueueWithTimer(5, false);
        this.isSigning = false;
        return new Uint8Array();
      }

      // check if the user has a valid session, otherwise sign a new one
      if (useAuthStore().authLevel === AuthLevel.ExpiredSession) {
        const success = await useAuthStore().authorize();
        if (!success) {
          this.status = QueueStatus.FAILED;
          this.errorText = "Error renewing session";
          this.resetQueueWithTimer(5, false);
          return new Uint8Array();
        }
        useAuthStore().login();
      }

      let txBytes: Uint8Array = new Uint8Array();
      // check if the draft is not empty
      try {
        this.status = QueueStatus.SIGNING;
        const client = (await $useWallet().wallet.client);
        const address = useAccountStore().address;
        const defaultFee: StdFee = {
          amount: [{
            amount: "1000",
            denom: useDesmosStore().ucoinDenom
          }],
          gas: "400000"
        };

        // sign the messages
        const msgs = (this.queue as TransactionQueueMsg[]).map((el: TransactionQueueMsg) => el.message);
        const details = (this.queue as TransactionQueueMsg[]).map((el: TransactionQueueMsg) => el.details);

        if (!useAccountStore().authz.hasAuthz) {
          const signed = await client.sign(address, msgs, defaultFee, "Signed from Scripta.network");
          txBytes = TxRaw.encode(signed).finish();
        }
        this.isSigning = false;

        // broadcast the messages
        this.status = QueueStatus.PENDING;

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

        // parse the result
        if (!broadcastResult?.transactionHash) {
          this.status = QueueStatus.FAILED;
          this.errorText = `${broadcastResult.rawLog}`;
          this.hash = broadcastResult.transactionHash;
          this.resetQueueWithTimer(8, false);
        } else {
          this.status = QueueStatus.SUCCESS;
          this.resetQueueWithTimer(5, true);
        }
        this.hash = broadcastResult.transactionHash;
        // TODO: ask for a profile refresh
      } catch (e) {
        this.status = QueueStatus.FAILED;
        this.errorText = `${e}`;
        this.resetQueueWithTimer(6, true);
      }
      useAccountStore().updateBalance();
      return txBytes;
    },
    /**
     * Sign and broadcast messages directy avoiding the queue
     * @param messages Encoded messages to sign and broadcast
     * @param details Custom details to be sent to the backend
     * @param skipAuthz Skip Authz, sign manually (usefull for tip, profile, etc.)
     * @returns success boolean
     */
    async directTx (messages: EncodeObject[], details: Record<string, unknown>[] = [], skipAuthz = false): Promise<boolean> {
      const { $useDesmosNetwork, $useWallet } = useNuxtApp();

      // if already processing a tx, wait the previous one to finish
      while (this.status !== QueueStatus.WAITING) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      this.status = QueueStatus.CONNECTING_WALLET;
      this.isSigning = true;
      try {
        await $useWallet().waitWalletActivation(); // recover the wallet signer & wait for it to be ready
      } catch (error) {
        this.status = QueueStatus.FAILED;
        this.errorText = "Wallet not connected or locked";
        this.resetQueueWithTimer(5, false);
        this.isSigning = false;
        return false;
      }

      // check if the user has a valid session, otherwise sign a new one
      if (useAuthStore().authLevel === AuthLevel.ExpiredSession) {
        const success = await useAuthStore().authorize();
        if (!success) {
          this.status = QueueStatus.FAILED;
          this.errorText = "Error renewing session";
          this.resetQueueWithTimer(5, false);
          return false;
        }
        useAuthStore().login();
      }

      this.assertBalance();
      try {
        let signedBytes = new Uint8Array();
        this.status = QueueStatus.SIGNING;
        if (!useAccountStore().authz.hasAuthz || skipAuthz) {
          signedBytes = await this.directSign(messages, "Signed from Scripta.network", $useDesmosNetwork().defaultFee, $useWallet().getSigner().signingMode);
        }

        this.isSigning = false;
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
        useAccountStore().updateBalance();
        this.status = QueueStatus.WAITING;
        return broadcastResult?.transactionHash || false;
      } catch (e) {
        // handle tx error or wallet signing rejection
        console.log(e);
        this.isSigning = false;
        useAccountStore().updateBalance();
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
    async directSign (messages: EncodeObject[], memo = "Signed from Scripta.network", fees = useNuxtApp().$useDesmosNetwork().defaultFee, signMode: 0 | 1 = 0): Promise<Uint8Array> {
      const { $useWallet, $useDesmosNetwork } = useNuxtApp();
      this.status = QueueStatus.CONNECTING_WALLET;
      this.isSigning = true;
      try {
        await $useWallet().waitWalletActivation(true); // recover the wallet signer & wait for it to be ready
      } catch (error) {
        this.status = QueueStatus.FAILED;
        this.errorText = "Wallet not connected or locked";
        this.resetQueueWithTimer(5, false);
        this.isSigning = false;
        return new Uint8Array();
      }

      // check if the draft is not empty
      try {
        this.status = QueueStatus.SIGNING;
        const client = await $useWallet().wallet.client;
        // client.setSigner($useWallet().wallet.signer as Signer);
        const address = useAccountStore().address;
        const accountInfo = await client.getAccount(address).catch(() => { return null; });
        // sign the messages
        const signed = await client.sign(address, messages, fees, memo,
          {
            accountNumber: accountInfo?.accountNumber || 0,
            chainId: $useDesmosNetwork().chainId,
            sequence: accountInfo?.sequence || 0
          }
        );
        const txBytes = TxRaw.encode(signed).finish();

        // broadcast the messages
        this.status = QueueStatus.SUCCESS;
        this.resetQueueWithTimer(0);
        this.isSigning = false;
        return txBytes;
      } catch (e) {
        console.log(e);
        this.status = QueueStatus.FAILED;
        this.errorText = `${e}`;
        this.resetQueueWithTimer(6);
      }
      this.isSigning = false;
      return new Uint8Array();
    },
    /**
     * Assert the balance is enough to perform the tx, otherwise throw and show the error.
     * If a fallback route is provided, it will be used to redirect the user.
     */
    assertBalance (fallbackRoute = "") {
      if (useAccountStore().balance <= 0.001 && !useAccountStore().authz.hasAuthz) {
        useNuxtApp().$useNotification().error("Low Balance", `You don't have enough ${useDesmosStore().coinDenom}`, 4);
        if (fallbackRoute) {
          useRouter().push(fallbackRoute);
        }
        throw new Error("Not enough balance");
      }
    },

    /**
     * Reset Tx Notification and Queue with a timer
     * @param s seconds to wait
     * @param reset `true` if should reset the queue
     */
    async resetQueueWithTimer (s: number, reset = false): Promise<void> {
      // sleep
      await new Promise(resolve => setTimeout(resolve, s * 1000));
      if (reset) {
        this.$reset();
      } else {
        this.status = QueueStatus.WAITING;
        this.hash = "";
        this.hash = "";
      }
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useTransactionStore);
