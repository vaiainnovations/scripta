<template>
  <div>
    <NavBarCard v-if="navBarReading.show">
      <template #central>
        <span class="text-lg font-bold">
          {{ navBarReading.title }}
        </span>
      </template>
      <template #right>
        <ArticlesViewUser class="flex-row-reverse" :address="navBarReading.address" :date="navBarReading.date" />
      </template>
    </NavBarCard>
    <NavBar v-else />
    <main class="h-screen pt-24 md:pt-16">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { Ref } from "vue";

export interface NavBarReadingType {
  show: boolean,
  title: string,
  address: string,
  date: Date
}
const navBarReading: Ref<NavBarReadingType> = ref({ show: false, title: "", address: "", date: new Date() });

provide("navBarReading", navBarReading);
</script>
