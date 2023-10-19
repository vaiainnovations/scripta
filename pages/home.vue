<template>
  <section>
    <span v-if="!useConfigStore().features.follow">
      <NuxtLayout name="profile">
        <div class="pt-10 lg:hidden">
          <ProfileUserView />
          <ProfileActions class="py-5" />
        </div>
        <ProfileArticles />
      </NuxtLayout>
    </span>
    <span v-else>
      <NuxtLayout name="profile">
        <ProfileHome />
      </NuxtLayout>
    </span>
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
