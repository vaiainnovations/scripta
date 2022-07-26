<template>
  <div class="mr-4 my-1">
    <div class="flex items-center">
      <div class="flex-none h-full align-middle mr-3 ml-2">
        <img src="/icons/linear/pending-circle.svg" class="my-auto h-8 w-8">
      </div>
      <div class="flex-grow">
        <div class="font-medium text-center">
          Broadcasting {{ $useTransaction().queue.length }}
          <span v-if="$useTransaction().queue.length===1">
            tx
          </span>
          <span v-else>
            txs
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $useTransaction } = useNuxtApp();
</script>
