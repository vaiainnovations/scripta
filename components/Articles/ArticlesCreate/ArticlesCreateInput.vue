<template>
  <div class="w-full flex flex-col gap-y-3 items-center pt-3">
    <!-- Title -->
    <div class="w-full flex flex-col items-center">
      <p class="text-primary-text-light font-medium text-xs self-start lg:text-sm">
        Title
      </p>
      <input v-model="titleContent" type="text" class="rounded-xl h-20 w-full border-primary-text-light border bg-background-alt font-bold text-xl text-primary-text">
    </div>
    <!-- Subtitle -->
    <div class="w-full flex flex-col items-center">
      <p class="text-primary-text-light font-medium text-xs lg:text-sm self-start">
        Subtitle
      </p>
      <textarea v-model="subtitleContent" type="text" class="rounded-xl h-32 w-full border border-primary-text-light bg-background-alt font-medium text-lg text-primary-text align-middle" />
    </div>
    <!-- Content -->
    <div class="w-full flex flex-col items-center">
      <p class="text-primary-text-light font-medium text-xs self-start lg:text-sm">
        Content
      </p>
      <MarkDownEditor />
    </div>
  </div>
</template>

<script setup lang="ts">
const titleContent = ref("");
const subtitleContent = ref("");
</script>
