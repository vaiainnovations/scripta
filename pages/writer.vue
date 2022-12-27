<script setup lang="ts">
useHead({
  title: "Scripta - Writer"
});
</script>

<template>
  <div>
    <NuxtLayout
      name="landing"
      class="w-screen"
    >
      <LandingGettingStarted class="pt-20" />
      <LandingFeatures />

      <TheFooter />
    </NuxtLayout>
  </div>
</template>
