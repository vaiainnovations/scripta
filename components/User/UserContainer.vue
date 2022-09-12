<template>
  <div class="bg-background-alt flex flex-col w-full gap-y-5 lg:flex-row lg:h-full lg:overflow-hidden">
    <div class="flex flex-col gap-y-14 lg:gap-y-0 lg:justify-evenly lg:w-1/3 py-14 lg:h-full">
      <UserDetails :user="props.user" />
    </div>
    <UserArticles :user="props.user" />
  </div>
</template>

<script lang="ts" setup>

interface Props {
  user: any;
}

const props = defineProps<Props>();
</script>
