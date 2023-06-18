<template>
  <!-- Flex container on a row -->
  <div class="flex h-fit w-full xl:w-2/3 mx-auto rounded-xl bg-background-alt">
    <div class="flex-grow">
      <NuxtLink
        :to="`/@${author.dtag}`"
        class="flex h-fit w-full flex-row items-center justify-start gap-x-1  py-2 px-1 md:gap-x-3 md:px-2 cursor-pointer group"
      >
        <ImageWrapper
          :img-url="author?.pictures?.profile || '/img/author_pic.png'"
          :img-class="'max-w-16 w-16 h-16 object-cover rounded-full border border-background'"
        />
        <p class="pl-3 md:text-2xl text-primary-text group-hover:text-primary-text/60 text-base truncate">
          <span v-if="author.nickname">
            {{ author.nickname }}
            <div class="text-sm text-gray-dark">
              @{{ author.dtag }}
            </div>
          </span>
          <span v-else>
            @{{ author.dtag }}
          </span>
        </p>
      </NuxtLink>
    </div>
    <div class="flex-0 my-auto pr-4">
      <UserFollowButton :address="props.address" :follows="[props.address]" :dtag="author.dtag" class="flex-0" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useUserStore } from "~/core/store/UserStore";

interface Props {
  address: string;
}

const props = defineProps<Props>();
const author = await useUserStore().getUser(props.address);
</script>
