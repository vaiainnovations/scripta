<template>
  <span v-if="!isEditing">
    <div class="lg:relative">
      <div class="absolute w-full flex flex-col items-end justify-start mt-7 lg:mt-0 right-8 lg:right-2 gap-y-32 lg:gap-y-36">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          class="w-5 h-5"
        >
          <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
        </svg>
        <img
          class="w-4 h-4 cursor-pointer"
          src="/icons/broken/edit.svg"
          @click="isEditing = true"
        >
      </div>
      <ProfileUserView />
    </div>
  </span>
  <span v-else>
    <ProfileUserEdit @user-edited="isEditing=false" />
  </span>
</template>

<script setup lang="ts">
const isEditing = ref(false);
</script>
