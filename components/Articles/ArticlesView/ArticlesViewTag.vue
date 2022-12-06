<template>
  <div class="w-full h-5">
    <slot>
      <TheTag :tag="props.content.value" />
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
