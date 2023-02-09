<script lang="ts" setup>
// Globally executed on every page load

import { usePostStore } from "./core/store/PostStore";

if (process.client) {
  const { $useAuth } = useNuxtApp();
  useNuxtApp().$useDesmosNetwork().init();
  $useAuth().init();
  await usePostStore().loadTrendings();
}

</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
@font-face {
    font-family: "Garet Book";
    src: local("Garet Book"),
     url(public/fonts/garet/Garet-Book.ttf) format("truetype");
}
@font-face {
    font-family: "Garet Heavy";
    src: local("Garet Heavy"),
     url(public/fonts/garet/Garet-Heavy.ttf) format("truetype");
}
</style>
