<template>
  <div class="w-fit">
    <!-- The profile icon is showed only on mobile screens (< 768 px) -->
    <!--  TODO if better md of lg breakpoint to show the name-->
    <div class="block md:hidden">
      <img src="icons/linear/profile-circle.svg" class="w-11 object-fill">
    </div>
    <!-- The button to write new article appears on larger screen (>= 768 px) -->
    <!--  TODO if better md of lg breakpoint to show the name-->
    <div class="hidden md:block">
      <div class="flex h-10 w-44 flex-row items-center justify-center rounded-lg border border-primary-text-light">
        <!-- TODO gradient color doesn't work even though it seems correct -->
        <button
          type="button"
          class="text-white bg-gradient-to-r from-primary-light to-[#5BFF6C] bg-clip-text text-2xl font-semibold"
        >
          Write
        </button>
      </div>
    </div>
  </div>
</template>
