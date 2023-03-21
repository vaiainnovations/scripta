<template>
  <span>
    <img
      v-if="!useAccountStore().profile?.pictures.profile"
      src="/img/author_pic.png"
      class="h-32 w-32 md:h-44 md:w-44 mb-4 object-contain border-2 shadow-md rounded-full border-[#EDEEFF] relative"
    >
    <ImageWrapper
      v-if="useAccountStore().profile?.pictures.profile"
      :img-url="useAccountStore().profile?.pictures.profile || '/img/author_pic.png'"
      :img-class="'h-32 w-32 md:h-44 md:w-44 mb-4 object-contain border-2 shadow-md rounded-full border-[#EDEEFF] relative'"
    />
  </span>
</template>
<script lang="ts" setup>
import { useAccountStore } from "~~/core/store/AccountStore";
</script>
