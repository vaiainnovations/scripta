<template>
  <span>
    <div class="flex flex-col justify-start items-center px-10 gap-y-3.5 h-fit mt-14 lg:mt-2">
      <ImageWrapper
        :img-url="props.user?.pictures?.profile || '/img/author_pic.png'"
        :img-class="'h-32 w-32 md:h-44 md:w-44 mb-4 object-contain border-2 shadow-md rounded-full border-[#EDEEFF]'"
      />
      <p class="text-3xl text-center font-bold">
        {{ props.user?.nickname || '' }}
      </p>
      <p class="text-xl text-center">
        @{{ props.user?.dtag || '' }}
      </p>
      <div class="flex-1 my-auto mx-2">
        <UserFollowButton :dtag="props.user?.dtag || ''" :address="props.user?.account?.address || ''" :follows="useAccountStore().follows || []" />
      </div>
      <div class="min-h-40 h-40 overflow-hidden">
        <p class="font-light text-xs text-center">
          {{ props.user?.bio || '' }}
        </p>
      </div>
    </div>
  </span>
</template>

<script lang="ts" setup>
import { useAccountStore } from "~/core/store/AccountStore";

interface Props {
  user: any
}

const props = defineProps<Props>();
</script>
