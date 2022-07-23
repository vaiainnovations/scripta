<template>
  <ClientOnly v-if="useTransactionStore().queue.length>0">
    <div class="absolute top-28 md:top-20 right-8 bg-background-alt border-2 border-gray-dark py-2 px-2 rounded-2xl text-xl shadow-xl">
      <div class="">
        <div v-if="useTransactionStore().status==='waiting'">
          <TransactionsQueueOverlayWaiting />
        </div>
        <div v-if="useTransactionStore().status==='signing'">
          Signing
        </div>
        <div v-if="useTransactionStore().status==='pending'">
          Pending
        </div>
        <div v-if="useTransactionStore().status==='success'">
          Success
        </div>
        <div v-if="useTransactionStore().status==='failed'">
          Failed
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useTransactionStore } from "~~/core/store/TransactionStore";
</script>
