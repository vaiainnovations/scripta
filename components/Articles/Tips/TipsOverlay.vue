<template>
  <div class="w-screen top-0 left-0 h-screen fixed flex align-middle items-center z-10">
    <div class="w-full sm:w-1/2 md:w-1/3 xl:w-1/4 p-2 mx-auto rounded-2xl shadow-xl bg-background-alt dark:bg-gray-800 ring-opacity-5 z-30 m-2">
      <div v-if="tipStatus === 'NONE'" class="py-1 p-5" role="menu" aria-orientation="vertical">
        <div class="text-center mt-2">
          <!-- <img src="/icons/bold/info-circle.svg" class="w-12 mx-auto"> -->
          <h2 class="text-4xl font-extrabold py-2 text-primary-text">
            Tip
          </h2>
          <div class="p-1">
            Sustain <span class="font-semibold">@{{ nickname }}</span><br> with a tip to support its work.
          </div>

          <div class="py-4 flex">
            <div
              v-for="amount in tipAmounts"
              :key="amount"
              class="h-14 w-14 mx-auto rounded-xl bg-background cursor-pointer border-2 border-background hover:border-primary"
              :class="{'border-primary': amount===tipAmount}"
              @click="setTipAmount(amount)"
            >
              <div class="font-bold h-full py-2">
                {{ amount }}
                <p class="text-[0.7rem] font-normal text-primary-text/70">
                  {{ (amount * $useDesmosNetwork().desmosPrice).toPrecision(2) }}$
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex">
          <div class="flex-grow selec">
            <label class="block text-xs font-medium text-gray-700 pt-2">
              Amount
            </label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-0 flex items-center pointer-events-none">
                <img src="/brands/desmos/logo.svg" class="w-6 h-6 ml-2">
              </div>
              <input v-model="tipAmount" type="number" min="1" class="outline-none py-2 px-4 block w-full pl-12 sm:text-sm rounded-md" placeholder="0">
            </div>
            <p class="text-xs font-light text-primary-text/60 pt-1" :class="{'text-danger': tipAmount > useAccountStore().balance }">
              You have: {{ useAccountStore().balance }} {{ $useDesmosNetwork().coinDenom }}
            </p>
          </div>
          <div v-if="tipAmount <= useAccountStore().balance" class="my-auto p-1 mx-3 hover:bg-background rounded-full">
            <img src="/icons/bold/send-2.svg" class="w-8 h-8 flex-1 cursor-pointer p-1 my-auto mx-auto" @click="sendTip">
          </div>
        </div>
      </div>
      <div v-if="tipStatus === 'PENDING'" class="text-center">
        <img
          src="/svg/spinner/dots.svg"
          class="h-8 p-2 my-4 mx-auto object-contain"
        >
        <h4 class="text-xl font-medium">
          Tipping...
        </h4>
      </div>
      <div v-if="tipStatus === 'SUCCESS'" class="text-center p-2">
        <img
          src="/icons/linear/tick-circle.svg"
          class="h-16 p-2 mx-auto object-contain"
        >
        <h4 class="text-xl font-medium">
          Thank you for your tip!
        </h4>
        <p>We're sure that @{{ nickname }} will appreciate your kind gesture.</p>
      </div>
      <div v-if="tipStatus === 'ERROR'" class="text-center">
        <img
          src="/icons/linear/close-circle.svg"
          class="h-16 p-2 mx-auto object-contain"
        >
        <h4 class="text-xl font-medium">
          Ops, something went wrong
        </h4>
        <p>Please retry later</p>
      </div>
    </div>
    <div class="w-screen top-0 left-0 h-screen fixed bg-gray/30 flex align-middle items-center z-10" @click="emit('closeTipsOverlay')" />
  </div>
</template>

<script lang="ts" setup>
import { MsgSendEncodeObject } from "@cosmjs/stargate";
import { useAccountStore } from "~~/core/store/AccountStore";
import { useUserStore } from "~~/core/store/UserStore";

interface Props {
    author: string;
}
const props = defineProps<Props>();
const emit = defineEmits(["closeTipsOverlay"]);

const tipAmounts = [5, 10, 50, 100];
const tipAmount = ref(1);
const tipStatus = ref("NONE" as "NONE" | "PENDING" | "SUCCESS" | "ERROR");

const nickname = ref(props.author);
nickname.value = (await useUserStore().getUser(props.author, true)).dtag;

const { $useDesmosNetwork } = useNuxtApp();
$useDesmosNetwork().updateDesmosPrice();

function setTipAmount (amount:number) {
  tipAmount.value = amount;
}

async function sendTip () {
  const { $useTransaction } = useNuxtApp();
  const msgSend: MsgSendEncodeObject = {
    typeUrl: "/cosmos.bank.v1beta1.MsgSend",
    value: {
      amount: [
        {
          amount: (tipAmount.value * 1_000_000).toString(),
          denom: $useDesmosNetwork().ucoinDenom
        }
      ],
      fromAddress: useAccountStore().address,
      toAddress: props.author
    }
  };
  tipStatus.value = "PENDING";
  const success = await $useTransaction().directTx([msgSend], [{
    scriptaOp: "MsgSend"
  }], true);
  tipStatus.value = success !== false ? "SUCCESS" : "ERROR";
  setTimeout(() => {
    tipStatus.value = "NONE";
    emit("closeTipsOverlay");
  }, 5000);
}
</script>
