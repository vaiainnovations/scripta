<template>
  <section>
    <NuxtLayout name="reading-custom">
      <UserContainer :username="username" />
    </NuxtLayout>
  </section>
</template>

<script setup lang="ts">
const route = useRoute();
const username = route.params.username as string;
</script>
