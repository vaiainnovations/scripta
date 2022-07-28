<template>
  <div class="bg-background-alt flex flex-col w-full gap-y-5 lg:flex-row lg:h-full lg:overflow-hidden">
    <div class="flex flex-col gap-y-14 lg:gap-y-0 lg:justify-evenly lg:w-1/3 py-14 lg:h-full">
      <UserDetails :user="user" />
    </div>
    <UserArticles :articles="articles" />
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from "~~/core/store/UserStore";

interface Props {
  address: string;
}

const props = defineProps<Props>();

const user = await useUserStore().getUser(props.address);
let articles = [];
if (process.client) {
  articles = await useUserStore().getUserArticles(user.account.address);
}
</script>
