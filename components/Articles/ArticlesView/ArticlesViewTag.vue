<template>
  <div class="flex w-20 h-5 flex-col justify-center rounded-xl bg-primary-light py-0.5">
    <slot>
      <p class="bg-primary-light text-center text-xs text-background-alt w-full h-5 rounded-xl">
        {{ props.content.value }}
      </p>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { TagType } from "~~/types/TagType";

interface Props {
  content: TagType;
}

const props = defineProps<Props>();
</script>
