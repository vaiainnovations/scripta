<template>
  <div class="h-screen">
    <NavBar />
    <div class="h-screen w-screen flex flex-row justify-center items-center">
      <div class="pt-12 md:py-2 bg-background-alt md:rounded-xl w-full md:w-1/2 xl:w-5/12 h-full md:h-fit px-2">
        <slot />
      </div>
    </div>
  </div>
</template>
