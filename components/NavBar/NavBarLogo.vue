<template>
  <div class="flex flex-row items-center justify-center gap-x-6">
    <!-- Logo image -->
    <svg class="h-10 w-10 fill-[#D9D9D9]" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="50" />
    </svg>
    <!-- Website name appears only on larger screen (>= 768 px)  -->
    <!--  TODO if better md of lg breakpoint to show the name-->
    <p class="hidden text-2xl font-medium md:block">
      Scripta
    </p>
  </div>
</template>
