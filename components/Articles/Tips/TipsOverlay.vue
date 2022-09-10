<template>
  <div class="w-screen top-0 left-0 h-screen fixed flex align-middle items-center z-10">
    <div class="w-full sm:w-1/2 md:w-1/3 xl:w-1/4 p-2 mx-auto rounded-2xl shadow-xl bg-background-alt dark:bg-gray-800 ring-opacity-5 z-30 m-2">
      <div class="py-1 p-5" role="menu" aria-orientation="vertical">
        <div class="text-center mt-2">
          <!-- <img src="/icons/bold/info-circle.svg" class="w-12 mx-auto"> -->
          <h2 class="text-3xl font-bold py-2 text-primary-text">
            Tip
          </h2>
          <div class="p-1">
            Sustain <span class="font-semibold">@{{ nickname }}</span><br> with a tip to support its work.
          </div>

          <div class="py-4 flex">
            <div
              v-for="amount in tipAmounts"
              :key="amount"
              class="py-3 w-12 mx-auto rounded-xl bg-background cursor-pointer border-2 border-background hover:border-primary"
              :class="{'border-primary': amount===tipAmount}"
              @click="setTipAmount(amount)"
            >
              {{ amount }}
            </div>
          </div>
        </div>

        <div class="flex">
          <div class="flex-grow selec">
            <label for="price" class="block text-xs font-medium text-gray-700">
              Amount
            </label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-0 flex items-center pointer-events-none">
                <span class="text-gray-500 sm:text-sm">
                  DSM
                </span>
              </div>
              <input v-model="tipAmount" type="number" min="1" class="outline-none py-2 px-4 block w-full pl-12 sm:text-sm rounded-md" placeholder="0">
            </div>
          </div>
          <img src="/icons/bold/send-2.svg" class="w-8 h-8 flex-1 ml-3 cursor-pointer my-auto" @click="sendTip">
        </div>
      </div>
    </div>
    <div class="w-screen top-0 left-0 h-screen fixed bg-background-alt/60 flex align-middle items-center z-10" @click="emit('closeTipsOverlay')" />
  </div>
</template>

<script lang="ts" setup>
import { MsgSendEncodeObject } from "@cosmjs/stargate";
import { useAccountStore } from "~~/core/store/AccountStore";
import { useDesmosStore } from "~~/core/store/DesmosStore";
import { useUserStore } from "~~/core/store/UserStore";

interface Props {
    author: string;
}
const props = defineProps<Props>();
const emit = defineEmits(["closeTipsOverlay"]);

const tipAmounts = [1, 5, 10, 50];
const tipAmount = ref(1);

const nickname = ref(props.author);
nickname.value = (await useUserStore().getUser(props.author, true)).dtag;

function setTipAmount (amount:number) {
  tipAmount.value = amount;
}

function sendTip () {
  const { $useTransaction } = useNuxtApp();
  const msgSend: MsgSendEncodeObject = {
    typeUrl: "/cosmos.bank.v1beta1.MsgSend",
    value: {
      amount: [
        {
          amount: (tipAmount.value * 1_000_000).toString(),
          denom: useDesmosStore().ucoinDenom
        }
      ],
      fromAddress: useAccountStore().address,
      toAddress: props.author
    }
  };
  $useTransaction().push(msgSend);
  emit("closeTipsOverlay");
}
</script>
