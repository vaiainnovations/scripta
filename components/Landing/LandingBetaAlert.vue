<template>
  <div class="w-screen top-0 left-0 h-screen fixed flex align-middle items-center z-10">
    <div class="w-full sm:w-1/2 md:w-1/3 xl:w-1/4 p-2 mx-auto rounded-2xl shadow-xl bg-background-alt dark:bg-gray-800 ring-opacity-5 z-30 m-2">
      <div
        class="py-1 p-5"
        role="menu"
        aria-orientation="vertical"
      >
        <div class="text-center mt-2">
          <!-- <img src="/icons/bold/info-circle.svg" class="w-12 mx-auto"> -->
          <h2 class="text-4xl font-extrabold py-2 text-primary-text">
            This is a Beta version
          </h2>
          <div class="p-1">
            This version is still under development, may contain bugs, and runs on top of the <b>Desmos Testnet</b> (morpheus-apollo-2).
            <div class="pt-2 text-sm">
              Please report any issues to the Scripta team.
            </div>
          </div>
        </div>

        <div class="text-center my-3">
          <button
            class="rounded-full p-2 px-5 shadow-4xl"
            @click="emit('closeBetaAlert')"
          >
            Ok
          </button>
        </div>
      </div>
    </div>
    <div
      class="w-screen top-0 left-0 h-screen fixed bg-gray/30 flex align-middle items-center z-10"
      @click="emit('closeBetaAlert')"
    />
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(["closeBetaAlert"]);
</script>
