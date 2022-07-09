<template>
  <div class="flex flex-col justify-start items-center px-10 gap-y-3.5 h-fit">
    <img :src="useAccountStore().profile?.pictures.profile || ''" class="h-32 w-32 lg:w-48 lg:h-48 object-cover border-2 shadow-md rounded-full border-[#EDEEFF]">
    <p class="text-3xl lg:text-4xl text-center font-bold">
      {{ useAccountStore().profile?.nickname || '' }}
    </p>
    <p class="text-xl lg:text-2xl text-center">
      @{{ useAccountStore().profile?.dtag || '' }}
    </p>
    <div class="min-h-40 h-40 overflow-hidden">
      <p class="font-light text-xs lg:text-sm text-center">
        {{ useAccountStore().profile?.bio || '' }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAccountStore } from "~~/core/store/AccountStore";
</script>
