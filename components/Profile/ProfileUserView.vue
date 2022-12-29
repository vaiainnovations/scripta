<template>
  <span>
    <div class="flex flex-col justify-start items-center px-10 gap-y-3.5 h-fit mt-14 lg:mt-2">
      <ProfileUserPic />
      <p class="text-3xl text-center font-bold">
        {{ useAccountStore().profile?.nickname || '' }}
      </p>
      <p class="text-xl text-center">
        @{{ useAccountStore().profile?.dtag || '' }}
      </p>
      <div class="min-h-10 max-h-40 overflow-hidden">
        <p class="font-light text-xs text-center">
          {{ useAccountStore().profile?.bio || '' }}
        </p>
      </div>
    </div>
  </span>
</template>

<script setup lang="ts">
import { useAccountStore } from "~~/core/store/AccountStore";
</script>
