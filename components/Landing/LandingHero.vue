<template>
  <section class="md:min-h-[55vh] px-10 2xl:px-40 bg-gradient-to-tr from-[#e5007e8b] to-[#f2910096] pt-40 md:pt-32 background-animate text-primary-text">
    <div class="h-full w-full pb-2">
      <!-- bg-[rgba(244,184,73,0.54)] -->
      <div class="container mx-auto px-4 h-full flex justify-center">
        <div class="md:flex">
          <div class="pb-20 md:pb-0 md:w-9/12 2xl:w-7/12 my-auto md:pl-10">
            <div class="text-primary-dark md:text-left">
              <div class="font-thin italic text-5xl sm:text-4xl xl:text-6xl tracking-wide md:p-0">
                verba volant<span class="pl-1">,</span>
              </div>
              <div class="font-black pt-2 text-4xl sm:text-3xl lg:text-4xl xl:text-6xl uppercase tracking-widest">
                scripta manent.
              </div>
            </div>
            <div class="pt-8 text-lg text-2xl xl:text-3xl font-extralight xl:mr-64">
              Explore stories, thoughts, and insights on any topics, without having worries about your privacy.

              <div class="gradient-text h-12 rounded-xl bg-white sm:px-5 md:px-10 xl:px-2 mt-8 w-full md:w-1/2 flex justify-center">
                <NuxtLink
                  to="/explore"
                  class="bg-gradient-to-r to-[#e5007e] from-[#f29100] bg-clip-text bg-background text-xl xl:text-2xl font-semibold my-auto"
                >
                  Start Reading
                </NuxtLink>
              </div>
            </div>
          </div>
          <div class="my-auto hidden md:block w-full mx-auto md:flex-1 mt-auto md:pt-0 2xl:pl-20 select-none pointer-events-none">
            <img
              src="https://cdn.discordapp.com/attachments/956124846750834719/1019643475194548224/3_med.png"
              class="2xl:w-3/5 "
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
