<template>
  <div class="mr-4 my-1">
    <div class="flex items-center">
      <div class="flex-none h-full align-middle mr-3 ml-2">
        <img src="/icons/linear/tick-error.svg" class="my-auto h-8 w-8">
      </div>
      <div class="flex-grow">
        <div class="font-medium text-center">
          Ops, an error!
        </div>
        <div class="text-center text-xs">
          {{ useTransactionStore().errorText }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTransactionStore } from "~~/core/store/TransactionStore";
</script>
