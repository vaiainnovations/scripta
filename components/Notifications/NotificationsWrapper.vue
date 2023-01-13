<template>
  <div class="w-full bg-background-alt border border-gray-dark py-1 px-2 rounded-xl text-xl shadow-xl z-40 duration-300 my-2">
    <div
      v-if="props.id >= 0"
      class="w-full hover:cursor-pointer -mt-4 -mr-4 float-right h-5 w-5"
      @click="$useNotification().close(props.id)"
    >
      <img
        src="/icons/bold/close-circle.svg"
        class="my-auto h-8 w-8"
      >
    </div>
    <slot />
  </div>
</template>

<script lang="ts" setup>
interface Props {
  id: number;
}

const props = defineProps<Props>();
</script>
