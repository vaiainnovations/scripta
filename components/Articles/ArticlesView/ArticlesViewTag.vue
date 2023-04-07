<template>
  <div class="w-full h-4">
    <slot>
      <TheTag :tag="props.content.value" :mode="'small'" />
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
