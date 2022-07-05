<template>
  <div class="flex w-20 flex-col justify-center rounded-xl bg-primary-light py-0.5">
    <p class="text-center text-xs text-background-alt">
      {{ props.content }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  content: string;
}

const props = defineProps<Props>();
</script>
