<template>
  <div class="bg-primary-light w-20 rounded-xl flex flex-col justify-center py-0.5">
    <p class="text-background-alt text-xs text-center">
      {{ props.content }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  content: string
}

const props = defineProps<Props>();

</script>
