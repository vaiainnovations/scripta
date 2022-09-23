<template>
  <section
    id="features"
    class="lg:h-[70vh] bg-purple 2xl:bg-background-alt"
  >
    <div class="container mx-auto px-4 h-full flex justify-center">
      <div class="grid grid-cols-12 lg:gap-20">
        <div class="my-auto w-full px-4 xl:p-16 mx-auto py-10 xl:mt-32 3xl:my-auto col-span-12 lg:col-span-6 font-serif text-background order-2 2xl:bg-[url('/img/landing/bg_features_abstract.svg')] 2xl:bg-no-repeat 2xl:bg-cover">
          <!-- Web3 -->
          <div v-if="activeDescription === 'web3'">
            <h2 class="text-4xl lg:text-6xl text-center xl:p-4">
              Web3, for real
            </h2>
            <div class="flex py-6 xl:p-12 text-3xl">
              <div class="">
                <div>It means that you own your <u>data</u>, your <u>content</u>, and your <u>identity</u>.</div>
                <div class="text-xl pt-2 text-gray-light">
                  <span class="font-semibold">Scripta is built on top of Desmos</span>, a blockchain for the next generation of social networks.
                </div>
              </div>
            </div>
          </div>

          <!-- Explore -->
          <span v-if="activeDescription === 'discover'">
            <h2 class="text-4xl lg:text-6xl text-center xl:p-4">Explore</h2>
            <div class="flex py-6 xl:p-12 text-3xl z-20">
              <div class=" text-center">
                <div>Search and discover new Articles, writers and artists.
                  <span class="font-semibold">Without being continuously monitored. </span>
                  <br><br>
                </div>
              </div>
            </div>
          </span>

          <!-- Create -->
          <span v-if="activeDescription === 'create'">
            <h2 class="text-4xl lg:text-6xl text-center xl:p-4">Without limits</h2>
            <div class="flex py-6 xl:p-12 text-3xl z-20">
              <div class=" text-center">
                <div>Express your thought and your creativity without the fear of being censored or tracked,
                  <span class="font-semibold">with a powerfull editor. </span>
                </div>
              </div>
            </div>
          </span>

          <!-- Discuss -->
          <span v-if="activeDescription === 'discuss'">
            <h2 class="text-4xl lg:text-6xl text-center">Discuss</h2>
            <div class="flex py-6 xl:p-12 text-3xl">
              <div class=" text-center">
                <div>Talk and discuss about your favorite Articles and express your opinions freely. <br>Show your support also with reactions!
                </div>
              </div>
            </div>
          </span>

          <!-- Tip -->
          <span v-if="activeDescription === 'tip'">
            <h2 class="text-4xl lg:text-6xl text-center xl:p-4">Show support</h2>
            <div class="flex py-6 xl:p-12 text-3xl">
              <div class=" text-center">
                <div>Encourage and support the work of you favorite writers and creators,
                  <span class="font-semibold">with tips of any amount.</span>
                </div>
                <div>Without fees!</div>
              </div>
            </div>
          </span>
        </div>
        <div class="md:flex-1 my-auto col-span-12 lg:col-span-6 md:px-10 order-1 2xl:order-last mx-auto">
          <div class="text-primary-dark py-10">
            <h3 class="font-extralight text-6xl text-center lg:text-7xl py-8 lg:-skew-x-12 lg:-skew-y-3 underline decoration-orange text-background 2xl:text-primary-text">
              It's time to evolve.
            </h3>
            <div class="py-4">
              <div class="grid grid-cols-12 gap-4 md:gap-10">
                <div
                  class="col-span-12 md:col-span-6 p-3 text-center bg-background hover:shadow-4xl text-2xl cursor-pointer font-serif"
                  :class="{'shadow-4xl': activeDescription==='create'}"
                  @mouseover="showDescription('create')"
                >
                  Create
                </div>
                <div
                  class="col-span-12 md:col-span-6 p-3 text-center bg-background hover:shadow-4xl text-2xl cursor-pointer font-serif"
                  :class="{'shadow-4xl': activeDescription==='web3'}"
                  @mouseover="showDescription('web3')"
                >
                  Web3
                </div>
                <div
                  class="col-span-12 md:col-span-6 p-3 text-center bg-background hover:shadow-4xl text-2xl cursor-pointer font-serif"
                  :class="{'shadow-4xl': activeDescription==='discover'}"
                  @mouseover="showDescription('discover')"
                >
                  Discover
                </div>
                <div
                  class="col-span-12 md:col-span-6 p-3 text-center bg-background hover:shadow-4xl text-2xl cursor-pointer font-serif"
                  :class="{'shadow-4xl': activeDescription==='discuss'}"
                  @mouseover="showDescription('discuss')"
                >
                  Discuss
                </div>
                <div
                  class="col-span-12 md:col-span-6 p-3 text-center bg-background hover:shadow-4xl text-2xl cursor-pointer font-serif"
                  :class="{'shadow-4xl': activeDescription==='tip'}"
                  @mouseover="showDescription('tip')"
                >
                  Tip
                </div>
              </div>
            </div>
          </div>
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
