<template>
  <div class="mr-4 my-1">
    <div class="flex items-center">
      <div class="flex-none h-full align-middle mr-3 ml-2">
        <img src="/icons/linear/tick-success.svg" class="my-auto h-8 w-8">
      </div>
      <div class="flex-grow">
        <div class="font-medium text-center">
          Success
        </div>
        <div class="text-center">
          <a
            class="text-gray-dark underline text-sm cursor-pointer"
            target="_blank"
            :href="`${$useDesmosNetwork().explorer}/transactions/${$useTransaction().hash}`"
          >
            {{ $useTransaction().hash.slice(0,14) }}...
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $useTransaction, $useDesmosNetwork } = useNuxtApp();
</script>
