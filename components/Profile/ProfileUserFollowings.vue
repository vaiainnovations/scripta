<template>
  <span v-if="useConfigStore().features.follow">
    <div class="flex flex-col justify-start items-center pt-10 px-10 lg:px-20 2xl:px-32 gap-y-3.5">
      <span v-if="useAccountStore().follows.length > 0" class="w-full">
        <div v-for="address in useAccountStore().follows" :key="address" class="w-full mb-3">
          <ProfileUserFollowing :address="address" />
        </div>
      </span>
      <div v-else class="md:flex w-full">
        <NuxtLink to="/explore" class="w-full bg-background-alt py-10 text-center rounded-2xl">
          <h1 class="text-xl my-auto hover:underline">
            Explore and start following new Authors!
          </h1>
        </NuxtLink>
      </div>
    </div>
  </span>
</template>

<script setup lang="ts">
import { useConfigStore } from "~/core/store/ConfigStore";
import { useAccountStore } from "~~/core/store/AccountStore";
</script>
