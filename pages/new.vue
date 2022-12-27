<template>
  <section>
    <NuxtLayout
      name="profile"
      :title="'Write'"
      :to="'/profile'"
    >
      <ArticlesCreate />
    </NuxtLayout>
  </section>
</template>

<script setup lang="ts">
useHead({
  title: "Scripta - Write"
});
definePageMeta({
  middleware: ["authenticated"]
});
</script>
