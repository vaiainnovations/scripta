<template>
  <div class="flex flex-row w-fit items-center">
    <!-- The button to write new article appears on larger screen (>= 768 px) -->
    <NuxtLink
      :to="!!useAccountStore().address ? '/new' : '/writer'"
      class="w-fit mr-4"
    >
      <div class="hidden md:block">
        <div class="gradient-text flex h-10 flex-row items-center justify-center rounded-xl border border-gray-light bg-white sm:px-5 md:px-10 mr-3">
          <button
            type="button"
            class="bg-gradient-to-r to-[#e5007e] from-[#f29100] bg-clip-text bg-background text-sm 2xl:text-2xl font-semibold"
          >
            Start Writing
          </button>
        </div>
      </div>
    </NuxtLink>

    <NuxtLink
      to="/home"
      class="w-11"
    >
      <div class="">
        <img
          v-if="!useAccountStore().profile?.pictures.profile"
          src="/icons/linear/profile-circle.svg"
          class="max-w-11 min-w-[2.75rem] w-11 h-11 object-cover rounded-full shadow-md border border-background"
        >
        <img
          v-if="useAccountStore().profile?.pictures.profile"
          :src="useAccountStore().profile?.pictures.profile"
          onerror="this.onerror=null;this.src='/img/author_pic.png'"
          class="max-w-11 min-w-[2.75rem] w-11 h-11 object-cover rounded-full shadow-md border border-background"
        >
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { useAccountStore } from "~~/core/store/AccountStore";
</script>

<style>
div.gradient-text {
  -webkit-text-fill-color: transparent;
}
</style>
