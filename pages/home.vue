<template>
  <section>
    <NuxtLayout name="profile">
      <!-- <ProfileUserEdit /> -->
      <ProfileHome v-if="useConfigStore().features.follow" />
      <ProfileArticles v-if="!useConfigStore().features.follow" />
    </NuxtLayout>
  </section>
</template>

<script setup lang="ts">
import { useConfigStore } from "~/core/store/ConfigStore";
definePageMeta({
  middleware: ["authenticated"]
});

useHead({
  title: "Scripta - Home"
});
</script>
