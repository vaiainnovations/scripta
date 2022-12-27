<template>
  <div class="flex">
    <NuxtLink
      to="/"
      class="flex flex-row items-center justify-center gap-x-6"
    >
      <!-- Logo image -->
      <img
        class="max-w-10 max-h-10 w-10 h-10"
        src="/logo/logo.svg"
      >
      <!-- Website name appears only on larger screen (>= 768 px)  -->
      <p class="hidden text-2xl font-medium md:block">
        Scripta
      </p>
    </NuxtLink>
    <NuxtLink
      class="ml-4 my-auto hover:underline cursor-pointer flex"
      to="/explore"
    >
      <img src="/icons/bold/bubble.svg" class="h-8 w-8 md:h-5 md:w-5">
      <span class="hidden md:block pl-1 my-auto">
        Explore
      </span>
    </NuxtLink>
  </div>
</template>
