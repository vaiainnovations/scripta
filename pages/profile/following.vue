<template>
  <section>
    <NuxtLayout name="profile" :title="'Following'" :to="'/home'">
      <ProfileUserFollowings />
    </NuxtLayout>
  </section>
</template>

<script setup lang="ts">
import { useConfigStore } from "~/core/store/ConfigStore";

definePageMeta({
  middleware: ["authenticated"],
  validate: () => {
    return useConfigStore().features.follow;
  }
});

useHead({
  title: "Scripta - Following"
});
</script>
