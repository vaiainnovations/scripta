<template>
  <section>
    <NuxtLayout name="reading-custom">
      <UserContainer :user="user" />
    </NuxtLayout>
  </section>
</template>

<script setup lang="ts">
import { useUserStore } from "~~/core/store/UserStore";
const route = useRoute();
const username = route.params.username as string;
useHead({
  title: `@${username} on Scripta`
});

const user = await useUserStore().getUser(username);
if (!user) {
  throw createError({
    statusCode: 404,
    message: "User Not Found",
    data: "Ooops! The User you're looking for isn't here."
  });
}
</script>
