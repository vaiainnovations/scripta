<template>
  <section>
    <NuxtLayout name="reading-custom">
      <ArticlesViewContainer :external-id="externalId" />
    </NuxtLayout>
  </section>
</template>

<script setup lang="ts">
const route = useRoute();
const externalId = route.params.id as string;
</script>
