<template>
  <!-- NavBar component, fixed element with notch on top for mobile devices (<768px) -->
  <div class="fixed top-0 h-fit w-screen bg-background-alt pt-8 md:pt-0 md:shadow-lg">
    <div class="flex h-16 flex-row items-center justify-between px-3 md:gap-x-24 md:px-8 xl:gap-x-48 xl:px-16">
      <!-- Logo on the left of the navbar -->
      <NavBarLogo />
      <!-- Search bar in the middle of the navbar -->
      <slot name="central">
        <NavBarSearchBar />
      </slot>
      <!-- Link to profile settings on the right of the navbar -->
      <slot name="right">
        <NavBarProfile />
      </slot>
    </div>
    <TransactionsQueueOverlay class="mt-20 mr-8" />
  </div>
</template>
