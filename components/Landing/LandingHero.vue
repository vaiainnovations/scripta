<template>
  <section class="h-screen md:h-[80vh]  bg-gradient-to-tr from-[#e5007e8b] to-[#f2910096] pt-40 md:pt-8 background-animate">
    <div class="h-full w-full">
      <!-- bg-[rgba(244,184,73,0.54)] -->
      <div class="container mx-auto px-4 h-full flex justify-center">
        <div class="md:flex">
          <div class="flex-1 my-auto md:pl-10">
            <div class="text-primary-dark text-center md:text-left">
              <div class="font-thin italic text-7xl xl:text-8xl tracking-wide p-4 md:p-0">
                verba volant<span class="pl-1">,</span>
              </div>
              <div class="font-black pt-6 text-primary-text text-6xl md:text-7xl xl:text-8xl uppercase tracking-widest">
                scripta manent.
              </div>
            </div>
            <!--  <div class="pt-14 text-2xl font-light">
              Discover a Decentrilezed way to share your thoughts.
            </div>
            <div class="pt-4 text-4xl text-background-alt font-serif underline">
              Available Soon
            </div>
            <div class="pt-6 text-2xl">
              <a href="">Try the Beta</a>
            </div> -->
          </div>
          <div class="w-full mx-auto flex flex-col-reverse pt-20 md:pt-0">
            <img
              src="https://cdn.discordapp.com/attachments/956124846750834719/1019643475194548224/3_med.png"
              class="w-3/5 mx-auto lg:mr-14 md:pb-10 my-auto"
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
  .background-animate {
    background-size: 400%;

    -webkit-animation: blurAnimated 10s ease infinite;
    -moz-animation: blurAnimated 10s ease infinite;
    animation: blurAnimated 10s ease infinite;
  }

  @keyframes blurAnimated {
    0%,
    100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }
</style>
