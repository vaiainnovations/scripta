<template>
  <div>
    <NavBar />
    <main class="h-screen w-screen pt-24 md:pt-32">
      <!-- Container for all components of path 'auth', width varies on different breakpoints -->
      <div class="mx-auto bg-background-alt px-2 md:h-fit md:w-2/3 md:rounded-xl md:py-2 lg:w-1/2 xl:w-5/12">
        <slot />
      </div>
    </main>
  </div>
</template>
