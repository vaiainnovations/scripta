<template>
  <!-- Features -->
  <section
    id="features"
    class="xl:h-[50vh]"
  >
    <div class="grid grid-cols-2 h-full">
      <div class="col-span-2 lg:col-span-1 bg-[#f86a32e6] noise flex py-10">
        <section
          id="decentralized"
          class="flex-grow my-auto p-8"
        >
          <h1 class="text-4xl md:text-6xl font-serif">
            Decentralized, no <div class="line-through hover:no-underline cursor-pointer flex w-full xl:w-1/2 mt-2">
              censorship
            </div>
          </h1>
          <p class="pt-10 text-2xl md:text-3xl font-light">
            Discover a better way to write your stories, without the fear of being censored.
          </p>
        </section>
      </div>
      <div class="col-span-2 lg:col-span-1 bg-primary-light noise flex group cursor-pointer group py-10">
        <section
          id="privacy"
          class="flex-grow my-auto p-8 blur-sm group-hover:hidden"
        >
          <h1 class="text-4xl md:text-6xl font-serif">
            ***** *** **** ****
          </h1>
          <p class="pt-10 text-2xl md:text-3xl font-light">
            **** ******* ***** ******** **** ** ***** ***** **** **** ******** ***
            ******* ** **** ******* ** *** *** ** *** ******* ** *** ** *** ******
            **** ******** **
          </p>
        </section>
        <div class="flex-grow my-auto p-8 group-hover:block hidden duration-1000">
          <h1 class="text-4xl md:text-6xl font-serif">
            Built for your privacy
          </h1>
          <p class="pt-10 text-2xl md:text-3xl font-light">
            Privacy is a fundamental human right.<br>
            We don't track, we don't sell your data, we don't even ask for your personal informations.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
const activeDescription = ref("create");
function showDescription (id: string) {
  activeDescription.value = id;
}
</script>
