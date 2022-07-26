<script lang="ts" setup>
const { $useTransaction } = useNuxtApp();
</script>

<template>
  <span v-if="$useTransaction && $useTransaction().queue.length>0">
    <div class="absolute top-28 md:top-20 right-8 bg-background-alt border-2 border-gray-dark py-2 px-2 rounded-2xl text-xl shadow-xl max-w-[85%] md:max-w-[30%] z-30">
      <div v-if="$useTransaction().status==='waiting'">
        <TransactionsQueueOverlayWaiting />
      </div>
      <div v-if="$useTransaction().status==='signing'">
        <TransactionsQueueOverlaySigning />
      </div>
      <div v-if="$useTransaction().status==='pending'">
        <TransactionsQueueOverlayPending />
      </div>
      <div v-if="$useTransaction().status==='success'">
        <TransactionsQueueOverlaySuccess />
      </div>
      <div v-if="$useTransaction().status==='failed'">
        <TransactionsQueueOverlayFailed />
      </div>
    </div>
  </span>
</template>
