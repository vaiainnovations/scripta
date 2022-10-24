<template>
  <section class="min-h-screen md:min-h-[80vh] bg-gradient-to-tr from-[#e5007e8b] to-[#f2910096] pt-28 md:pt-40 background-animate">
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
            <!-- <div class="pt-14 text-2xl font-light">
              Discover a Decentrilezed way to share your thoughts.
            </div> -->
            <div
              v-if="!useConfigStore().isBetaVersion"
              class="flex flex-col bg-background items-center p-6 m-2 bg-indigo-600 rounded-lg shadow-4xl gap-4 sm:flex-row sm:justify-between order-1 mt-10"
            >
              <strong class="text-3xl text-white lg:text-3xl text-center">
                Available <span class="text-xs align-top">(very)</span> Soon!
              </strong>

              <a
                class="inline-flex items-center px-8 py-3 text-indigo-600 bg-white border border-white rounded-full hover:bg-transparent hover:text-white active:bg-white/90 focus:outline-none focus:ring"
                href="https://beta.scripta.network"
              >
                <span class="text-xs font-medium"> Try the Beta! </span>

                <img
                  class="w-5 h-5 ml-3"
                  src="/icons/linear/arrow-right.svg"
                >
              </a>
            </div>
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

<script lang="ts" setup>
import { useConfigStore } from "~~/core/store/ConfigStore";
</script>

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
