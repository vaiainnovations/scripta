<template>
  <ClientOnly v-if="useTransactionStore().queue.length>0">
    <div class="absolute top-28 md:top-20 right-8 bg-background-alt border-2 border-gray-dark py-2 px-2 rounded-2xl text-xl shadow-xl max-w-[85%] md:max-w-[30%] z-30">
      <div class="">
        <div v-if="useTransactionStore().status==='waiting'">
          <TransactionsQueueOverlayWaiting />
        </div>
        <div v-if="useTransactionStore().status==='signing'">
          <TransactionsQueueOverlaySigning />
        </div>
        <div v-if="useTransactionStore().status==='pending'">
          <TransactionsQueueOverlayPending />
        </div>
        <div v-if="useTransactionStore().status==='success'">
          <TransactionsQueueOverlaySuccess />
        </div>
        <div v-if="useTransactionStore().status==='failed'">
          <TransactionsQueueOverlayFailed />
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useTransactionStore } from "~~/core/store/TransactionStore";
</script>
