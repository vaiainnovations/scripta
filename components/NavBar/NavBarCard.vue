<template>
  <!-- NavBar component, fixed element with notch on top for mobile devices (<768px) -->
  <div class="fixed top-0 h-fit w-screen bg-background-alt pt-8 md:pt-0 md:shadow-lg z-50">
    <!-- <div class="bg-danger px-4 py-3 text-white">
      <p class="text-center text-sm font-medium">
        Desmos Testnet is halted, some features may not work as expected until the network is back online.
      </p>
    </div> -->
    <div class="flex h-16 flex-row items-center justify-between px-3 md:gap-x-24 md:px-8 xl:gap-x-48 xl:px-16">
      <!-- Logo on the left of the navbar -->
      <slot name="left">
        <NavBarLogo />
      </slot>
      <!-- Search bar in the middle of the navbar -->
      <slot name="central">
        <NavBarSearchBar />
      </slot>
      <!-- Link to profile settings on the right of the navbar -->
      <slot name="right">
        <NavBarProfile />
      </slot>
      <NotificationsOverlay class="absolute top-28 md:top-20 right-8" />
    </div>
  </div>
</template>
