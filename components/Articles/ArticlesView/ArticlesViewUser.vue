<template>
  <div class="flex flex-row gap-x-3 pt-2 lg:gap-x-2.5">
    <img :src="props.user.image" class="h-12 w-10 object-contain">
    <div class="flex flex-col">
      <p class="text-lg font-medium text-primary-text">
        {{ props.user.name }}
      </p>
      <p class="text-sm font-medium text-primary-text-light">
        {{ props.user.date }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface UserType {
  name: string,
  date: string,
  image: string
}

interface Props {
  user: UserType
}

const props = defineProps<Props>();
</script>
