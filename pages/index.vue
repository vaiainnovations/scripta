<script setup lang="ts">
const title = "Hello Scripta";
useHead({
  title
});
</script>

<template>
  <section>
    <NuxtLayout name="custom">
      <div>
        {{ title }}
      </div>
    </NuxtLayout>
  </section>
</template>
