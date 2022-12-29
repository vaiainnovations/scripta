<template>
  <span>
    <img
      v-if="!useAccountStore().profile?.pictures.profile"
      src="/img/author_pic.png"
      class="h-32 w-32 md:h-44 md:w-44 mb-4 object-contain border-2 shadow-md rounded-full border-[#EDEEFF] relative"
    >
    <img
      v-if="useAccountStore().profile?.pictures.profile"
      :src="useAccountStore().profile?.pictures.profile"
      onerror="this.onerror=null;this.src='/img/author_pic.png'"
      class="h-32 w-32 md:h-44 md:w-44 mb-4 object-contain border-2 shadow-md rounded-full border-[#EDEEFF] relative"
    >
  </span>
</template>
<script lang="ts" setup>
import { useAccountStore } from "~~/core/store/AccountStore";
</script>
