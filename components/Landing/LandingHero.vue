<template>
  <section class="md:min-h-[60vh] px-10 2xl:px-40 bg-gradient-to-tr from-[#e5007e8b] to-[#f2910096] pt-40 md:pt-32 background-animate text-primary-text">
    <div class="h-full w-full">
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
              Explore stories, thoughts, and insights on any topics, without having worries about your privacy

              <div class="gradient-text h-12 rounded-xl bg-white sm:px-5 md:px-10 mt-8 w-full md:w-1/2 flex justify-center">
                <button
                  type="button"
                  class="bg-gradient-to-r to-[#e5007e] from-[#f29100] bg-clip-text bg-background text-2xl font-semibold "
                >
                  Start Reading
                </button>
              </div>
            </div>
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
          <div class="hidden md:block w-full mx-auto md:flex-1 mt-auto md:pt-0 2xl:pl-20">
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
