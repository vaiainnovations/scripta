<template>
  <div class="">
    <div class="flex items-center">
      <div class="flex-1 h-full align-middle mr-1 ml-2">
        <img src="/icons/linear/tick-mouse.svg" class="my-auto h-16 w-16">
      </div>
      <div class="flex-grow">
        <div class="font-medium text-center">
          {{ useTransactionStore().queue.length }}
          <span v-if="useTransactionStore().queue.length===1">
            action
          </span>
          <span v-else>
            actions
          </span>
          waiting
        </div>
        <div class="text-center text-gray-dark text-sm underline pt-1">
          Click to Approve
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTransactionStore } from "~~/core/store/TransactionStore";
</script>
