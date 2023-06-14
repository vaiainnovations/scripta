<template>
  <div v-if="author && author.dtag" class="flex flex-row pt-2 lg:gap-x-2.5">
    <NuxtLink :to="`/@${author.dtag}`" class="flex gap-x-3 group">
      <ImageWrapper
        :img-url="author.pictures.profile || '/img/author_pic.png'"
        :img-class="'w-10 h-10 md:h-12 md:w-12 object-cover my-auto rounded-full pointer-events-none'"
      />
      <div class="flex flex-col">
        <p class="text-lg font-medium text-primary-text group-hover:text-primary-text-light">
          {{ author.nickname || author.dtag }}
        </p>
        <p v-if="props.date && props.date.getTime() != 0" class="text-sm font-medium text-primary-text-light">
          {{ new Date(props.date).toLocaleDateString() }}
        </p>
      </div>
    </NuxtLink>
    <div class="flex-1 my-auto mx-2">
      <UserFollowButton :dtag="author?.dtag || ''" :address="author?.account?.address || ''" />
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

const navBarReading: Ref<NavBarReadingType> = inject("navBarReading");
// eslint-disable-next-line vue/no-setup-props-destructure
navBarReading.value.address = props.address;
// eslint-disable-next-line vue/no-setup-props-destructure
navBarReading.value.date = props.date;
</script>
