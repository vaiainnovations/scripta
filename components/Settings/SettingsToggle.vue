<template>
  <div class="flex justify-center w-full px-5">
    <label
      class="flex items-center cursor-pointer w-full justify-between"
    >
      <div class="text-primary-text font-medium select-none pr-4 lg:pr-8">
        <slot />
      </div>
      <div class="relative">
        <input
          :checked="props.modelValue"
          type="checkbox"
          class="sr-only"
          @input="updateValue"
        >
        <div class="block bg-background-alt lg:bg-background w-12 h-7 rounded-full border border-gray-dark/10" />
        <div class="dot bg-background-alt absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition border-2 border-primary-light" />
      </div>
    </label>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  modelValue: boolean
}
const props = defineProps<Props>();

const emit = defineEmits(["update:modelValue"]);

const updateValue = (event) => {
  emit("update:modelValue", event.target.checked);
};
</script>

<style scoped>
input:checked ~ .dot {
  transform: translateX(100%);
  background-color: rgb(62 134 225);
}
</style>
