<template>
  <div>
    <NavBarCard v-if="navBarReading.show">
      <template #central>
        {{ navBarReading.title }}
      </template>
      <template #right>
        {{ navBarReading.user.name }}
        <ArticlesViewUser class="flex-row-reverse" :user="navBarReading.user" />
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
interface UserType {
  name: string,
  date: string,
  image: string
}

interface NavBarReadingType {
  show: boolean,
  title: string,
  user: UserType
}

const navBarReading: Ref<NavBarReadingType> = ref({ show: false, title: "", user: { name: "", date: "", image: "" } });

provide("navBarReading", navBarReading);
</script>
