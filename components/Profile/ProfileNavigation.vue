<template>
  <div class="w-full pt-14 lg:pt-0 lg:fixed bg-background-alt">
    <div class="py-6 px-4 md:px-20 xl:px-32">
      <div class="flex">
        <NuxtLink v-if="p.props.to" :to="p.props.to">
          <img
            src="/icons/bold/arrow-left-circle.svg"
            class="my-auto h-full h-8 w-8"
            alt="Back"
          >
        </NuxtLink>
        <h6 class="text-2xl font-bold ml-5">
          {{ p.props.title }}
        </h6>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ProfileNavigationProps } from "~~/layouts/profile.vue";
interface Props {
  props: ProfileNavigationProps;
}
const p = defineProps<Props>();
</script>
