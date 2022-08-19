<script lang="ts" setup>
import { useAccountStore } from "~~/core/store/AccountStore";

const canWrite = ref(false);
if (process.client) {
  if (useAccountStore().address) {
    canWrite.value = true;
  }
}
</script>

<template>
  <div class="p-3">
    <div
      v-if="canWrite"
      class=""
    >
      <div class="flex">
        <img
          :src="useAccountStore().profile?.pictures?.profile || ''"
          class="h-7 w-7 md:h-10 md:w-10 rounded-full mr-1 lg:mr-3"
        >
        <textarea
          id=""
          name=""
          placeholder="Write a comment..."
          class="w-full rounded-3xl h-36 p-2 px-4 bg-background-alt resize-none border-4 border-background-alt"
          maxlength="500"
        />
      </div>
      <div class="relative -mt-[2.7rem] -mr-1 flex flex-1 float-right pr-2">
        <button class="hover:bg-primary/50 text-background-alt rounded-full bg-primary/10 p-2 transition duration-150 ease-in-out">
          <img
            class=""
            src="/icons/bold/send-2.svg"
            alt=""
          >
        </button>
      </div>
    </div>
  </div>
</template>
