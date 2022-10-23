<template>
  <!-- Container to set the position of the tooltip -->
  <!-- Tooltip box with relative position -->
  <div class="relative mx-auto rounded-2xl bg-background md:px-4 shadow-2xl w-full sm:w-3/4 xl:w-3/5">
    <div class="grid grid-cols-12">
      <div class="col-span-12 mx-auto">
        <h6 class="text-center text-2xl font-bold pt-6 pb-3">
          Search Results
        </h6>
      </div>
      <!-- Articles Results -->
      <div class="col-span-12 xl:col-span-8 px-4 max-h-[60vh] xl:max-h-[80vh]">
        <div class="flex w-full flex-col place-content-center items-start gap-y-3">
          <div
            v-if="useSearchStore().articleResults.length > 0"
            class="order-last flex flex-col gap-y-2 md:order-none col-span-5 col-start-2 overflow-visible"
          >
            <!-- md:col-span-4 md:col-start-1 -->
            <div class="overflow-scroll max-h-[60vh] xl:max-h-[80vh]">
              <SearchArticleCard
                v-for="result in useSearchStore().articleResults"
                :key="result.externalId"
                :post="result"
                class="my-2"
              />
            </div>
          </div>
          <span
            v-else
            class="text-center col-span-7"
          >
            <!-- No Articles found. -->
          </span>
        </div>
      </div>

      <!-- User Results -->
      <div
        class="col-span-12 xl:col-span-4 px-4 max-h-[30vh]"
        :class="{'xl:col-span-12': useSearchStore().articleResults.length === 0}"
      >
        <div class="flex w-full flex-col place-content-center items-start gap-y-3">
          <div
            v-if="useSearchStore().userResults.length > 0 || useSearchStore().articleResults.length > 0"
            class="order-last flex flex-col gap-y-2 md:order-none col-span-5 col-start-2 w-full"
          >
            <p class="text-xl text-center pt-3">
              Authors
            </p>
            <div
              v-if="useSearchStore().userResults.length > 0"
              class="overflow-scroll max-h-[20vh] xl:max-h-[30vh]"
            >
              <SearchAuthorCard
                v-for="result in useSearchStore().userResults"
                :key="result.dtag"
                :author="result"
                class="my-2"
              />
            </div>
            <div
              v-else
              class="col-span-12 text-center py-7 mx-5 bg-background-alt my-5 rounded-2xl"
            >
              No Authours found!
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="useSearchStore().articleResults.length === 0 && useSearchStore().userResults.length === 0"
        class="col-span-12 text-center py-7 mx-20 bg-background-alt my-5 rounded-2xl"
      >
        Ops, nothing found!
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useSearchStore } from "~~/core/store/SearchStore";
</script>
