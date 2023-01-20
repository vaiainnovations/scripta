<template>
  <span>
    <div class="flex flex-col flex-grow pt-2 xl:pt-6">
      <div class="grid grid-cols-12">
        <!-- Balance -->
        <div class="col-span-12 xl:col-span-5 2xl:col-span-4 xl:order-2">
          <div class="xl:bg-background-alt rounded-xl p-5 ">
            <!-- Balance -->
            <span>
              <h1 class="text-3xl font-bold">
                Balance
              </h1>
              <div class="pb-2 pt-1">
                <NuxtLayout
                  name="tooltip"
                  :title="'Copy Address'"
                  :position="'Top'"
                >
                  <div v-if="useAccountStore()?.address">
                    <p
                      class="text-[0.7rem] text-gray flex cursor-pointer hover:underline break-all mr-2"
                      @click="copyAddress(useAccountStore()?.address || '')"
                    >
                      <img
                        src="/icons/linear/copy.svg"
                        class="h-3 w-3 object-contain my-auto mr-1"
                      >
                      {{ useAccountStore()?.address || '' }}
                    </p>
                  </div>
                </NuxtLayout>
              </div>
              <div class="flex flex-row gap-x-3 pt-3">
                <img
                  src="/svg/wallet/dpm/logo.svg"
                  class="h-8 w-8 object-contain my-auto"
                >
                <p class="text-3xl 2xl:text-4xl font-extralight my-auto">
                  {{ useAccountStore().balance.toLocaleString() }} {{ coinDenom }}
                </p>
              </div>
            </span>

            <!-- Buy DSM -->
            <div class="mt-5 w-full">
              <a
                class="text-lg bg-primary-light/100 hover:bg-primary-light/90 text-background-alt py-0.5 flex justify-center rounded-md"
                href="https://frontier.osmosis.zone/?from=ATOM&to=DSM"
                target="_blank"
              > Buy ${{ coinDenom }}</a>
            </div>

            <!-- History -->
            <div class="mt-2 w-full">
              <a
                class="text-md text-primary-text-light hover:text-primary-text py-0.5 flex justify-center"
                :href="`${useNuxtApp().$useDesmosNetwork().explorer}/accounts/${useAccountStore().address}`"
                target="_blank"
              >Transaction History <img
                src="/icons/linear/link.svg"
                class="ml-2 my-auto w-5 h-5"
              ></a>
            </div>

            <!-- Tutorial -->
            <div
              v-if="showBuyTutorial"
              class="bg-background pb-4 pt-2 px-2 mb-4 mt-10 group rounded-xl"
            >
              <!-- Next/Previous arrows and close btn -->
              <div class="flex w-full">
                <div class="flex-grow">
                <!--  -->
                </div>
                <div class="flex-1 justify-self-end">
                  <img
                    src="/icons/linear/close.svg"
                    class="w-7 h-7 float-right cursor-pointer hover:bg-background-alt rounded-full"
                    @click="showBuyTutorial = false"
                  >
                </div>
              </div>
              <div
                class="hover:bg-background-alt py-1 px-2 rounded-lg cursor-pointer"
                @click="openTutorial('')"
              >
                <div class="flex">
                  <div class="flex-grow">
                    <h3 class="text-lg font-semibold">
                      How to buy $DSM on Osmosis
                    </h3>
                    <p class="text-sm text-gray">
                      Find out how to buy and deposit on Scripta $DSM.
                    </p>
                  </div>
                  <div class="flex-none my-auto">
                    <img
                      src="/brands/osmosis/logo.svg"
                      alt=""
                      class="w-14 h-14"
                    >
                  </div>
                </div>
                <p class="text-sm text-primary-light font-bold group-hover:underline cursor-pointer pt-1">Take a look ></p>
              </div>
            </div>

          </div>
        </div>

        <!-- Rewards -->
        <div class="col-span-12 xl:col-span-7 2xl:col-span-8 order-2 xl:order-1">
          <div class="flex flex-row gap-x-3 p-5 pb-2">
            <div class="flex flex-col flex-grow">
              <h1 class="text-3xl font-bold">
                Rewards
              </h1>
            </div>
          </div>
          <div class="mx-4 xl:pr-16">
            <div v-if="$useReward().rewardsHistory === false">
              <div
                v-for="x in 3"
                :key="x"
                class="bg-background-alt m-1 animate-pulse h-16 rounded-lg mb-2"
              />
            </div>
            <div
              v-else
            >
              <div
                v-if="$useReward().rewardsHistory !== false && $useReward().rewardsHistory.length <= 0"
                class="p-5 bg-background-alt rounded-xl"
              >
                <div class="flex flex-col flex-grow">
                  <p class="text-lg font-semibold">
                    No rewards received
                  </p>
                  <p class="text-sm text-gray">
                    You have not received any reward yet.
                  </p>
                </div>
              </div>
              <div v-else>
                <div
                  v-for="reward, i in $useReward().rewardsHistory || []"
                  :key="i"
                  class="my-4"
                >
                  <div class="flex w-full p-5 bg-background-alt rounded-xl">
                    <div class="flex-none my-auto pr-4">
                      <span v-if="reward.type === 'faucet'">
                        <img src="/icons/linear/flag.svg" class="w-11 h-11">
                      </span>
                      <span v-else-if="reward.type === 'rewardsLaunch'">
                        <img src="/icons/linear/cup.svg" class="w-11 h-11">
                      </span>
                      <span v-else-if="reward.type === 'MsgSend'">
                        <img src="/icons/linear/tip.svg" class="w-11 h-11">
                      </span>
                      <span v-else>
                        <img src="/icons/linear/medal.svg" class="w-11 h-11">
                      </span>
                    </div>

                    <div class="flex-grow">
                      <!-- Amount -->
                      <div>
                        <span class="text-2xl font-medium">
                          {{ reward.amount[0]?.amount }}
                        </span>
                        <span class="uppercase pl-2">
                          {{ reward.amount[0]?.denom }}
                        </span>
                      </div>

                      <!-- Description -->
                      <div class="text-sm font-light">
                        <span v-if="reward.type === 'faucet'">
                          First time! Welcome bonus, to start discovering Scripta.
                        </span>
                        <span v-else-if="reward.type === 'rewardsLaunch'">
                          Thank you for creating content and articles on Scripta, you deserved an award!
                        </span>
                        <span v-else-if="reward.type === 'MsgSend'">
                          Tip
                          <span v-if="reward.from"> from
                            <NuxtLink :to="`/@${reward.from.dtag}`" class="hover:underline">
                              @{{ reward.from.dtag || reward.from.address }}
                            </NuxtLink>
                          </span>
                        </span>
                        <span v-else>
                          {{ reward.type }}
                        </span>
                      </div>
                    </div>

                    <div class="flex-none justify-end my-auto">
                      <!-- Date -->
                      <div class="font-extralight">
                        {{ reward.timestamp.toLocaleDateString() }}
                      </div>

                      <!-- Details -->
                      <div class="text-xs text-center pt-1">
                        <a :href="`${$useDesmosNetwork().explorer}transactions/${reward.hash}`" class="text-gray hover:text-gray-dark hover:underline" target="_blank">Details</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </span>
</template>

<script lang="ts" setup>
import { useAccountStore } from "~~/core/store/AccountStore";

const { $useDesmosNetwork } = useNuxtApp();
const coinDenom = ref("");
const showBuyTutorial = ref(false); /* disabled temporary */

if (process.client) {
  coinDenom.value = $useDesmosNetwork().coinDenom.toUpperCase();
  useAccountStore().updateUserAccount();
}

/**
 * Copy address to clipboard
 */
function copyAddress /*  */(address = "") {
  navigator.clipboard.writeText(address);
  useNuxtApp().$useNotification().push("Address Copied", "", 1, "");
}

function openTutorial /*  */(link = "") {
  window.open(link, "_blank");
}
</script>
