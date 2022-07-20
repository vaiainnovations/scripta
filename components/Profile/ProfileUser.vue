<template>
  <div class="lg:relative">
    <div class="absolute w-full flex flex-col items-end justify-start mt-7 lg:mt-0 right-8 lg:right-2 gap-y-32 lg:gap-y-36">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        class="w-5 h-5"
      >
        <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
      </svg>
      <img src="/icons/broken/edit.svg" class="w-4 h-4">
    </div>
    <div class="flex flex-col justify-start items-center px-10 gap-y-3.5 h-fit mt-14 lg:mt-2">
      <img :src="useAccountStore().profile?.pictures.profile || ''" class="h-32 w-32 object-contain border-2 shadow-md rounded-full border-[#EDEEFF]">
      <p class="text-3xl text-center font-bold">
        {{ useAccountStore().profile?.nickname || '' }}
      </p>
      <p class="text-xl text-center">
        @{{ useAccountStore().profile?.dtag || '' }}
      </p>
      <div class="min-h-40 h-40 overflow-hidden">
        <p class="font-light text-xs text-center">
          {{ useAccountStore().profile?.bio || '' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAccountStore } from "~~/core/store/AccountStore";
</script>
