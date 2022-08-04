<template>
  <div class="flex flex-row w-fit items-center">
    <!-- The button to write new article appears on larger screen (>= 768 px) -->
    <NuxtLink
      to="/new"
      class="w-fit mr-4"
    >
      <div class="hidden md:block">
        <div class="gradient-text flex h-10 flex-row items-center justify-center rounded-lg border border-primary-text-light sm:px-5 md:px-10 mr-3">
          <button
            type="button"
            class="bg-gradient-to-r from-primary-light to-green-light bg-clip-text text-2xl font-semibold"
          >
            Write
          </button>
        </div>
      </div>
    </NuxtLink>

    <NuxtLink
      to="/profile"
      class="w-11"
    >
      <div class="">
        <img
          :src="userPic"
          onerror="this.src='/img/author_pic.png'"
          class="max-w-11 w-11 h-11 object-cover rounded-full"
        >
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { useAccountStore } from "~~/core/store/AccountStore";
const userPic = ref("/icons/linear/profile-circle.svg");
if (process.client) {
  useAccountStore().$subscribe(() => {
    updateUserPic();
  });
  updateUserPic();
}

function updateUserPic () {
  if (!useAccountStore().profile) {
    return;
  }
  if (useAccountStore().profile.pictures) {
    userPic.value = useAccountStore().profile.pictures.profile;
  }
}
</script>

<style>
div.gradient-text {
  -webkit-text-fill-color: transparent;
}
</style>
