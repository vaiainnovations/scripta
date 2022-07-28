<template>
  <div class="flex flex-row gap-x-3 pt-2 lg:gap-x-2.5">
    <img :src="author.pictures.profile" class="h-12 w-12 object-cover rounded-full">
    <div class="flex flex-col">
      <p class="text-lg font-medium text-primary-text">
        {{ author.nickname || author.dtag }}
      </p>
      <p class="text-sm font-medium text-primary-text-light">
        {{ new Date(props.date).toLocaleString() }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref } from "vue";
import { useUserStore } from "~~/core/store/UserStore";
import { NavBarReadingType } from "~~/layouts/readingCustom.vue";

interface Props {
  address: string
  date: Date
}

const props = defineProps<Props>();
const author = await useUserStore().getUser(props.address, true);

const navBarReading : Ref<NavBarReadingType> = inject("navBarReading");
// eslint-disable-next-line vue/no-setup-props-destructure
navBarReading.value.address = props.address;
// eslint-disable-next-line vue/no-setup-props-destructure
navBarReading.value.date = props.date;
</script>
