<template>
  <section
    id="features"
    class="lg:h-[70vh] bg-purple 2xl:bg-background-alt"
  >
    <div class="container mx-auto px-4 h-full flex justify-center">
      <div class="grid grid-cols-12 lg:gap-20">
        <div class="w-full px-4 xl:p-16 mx-auto mt-32 3xl:my-auto col-span-12 lg:col-span-6 font-serif text-background order-2 2xl:bg-[url('/img/landing/bg_features_abstract.svg')] 2xl:bg-no-repeat 2xl:bg-cover">
          <!-- Web3 -->
          <div v-if="activeDescription === 'web3'">
            <h2 class="text-4xl lg:text-6xl text-center">
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
            <h2 class="text-4xl lg:text-6xl text-center">Explore</h2>
            <div class="flex py-6 xl:p-12 text-3xl">
              <div class="text-center">
                <div>Search and discover new Articles, writers and artists.<br><br> <span class="font-bold">Without being tracked. </span></div><br><br>
              </div>
            </div>
          </span>

          <!-- Create -->
          <span v-if="activeDescription === 'create'">
            <h2 class="text-4xl lg:text-6xl text-center">Without limits</h2>
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
            <h2 class="text-4xl lg:text-6xl text-center">Discuss freely</h2>
            <div class="flex py-6 xl:p-12 text-3xl">
              <div class=" text-center">
                <div>Talk about your favorite Articles, and share your opinion with the community.<br>
                </div>
              </div>
            </div>
          </span>

          <!-- Tip -->
          <span v-if="activeDescription === 'tip'">
            <h2 class="text-4xl lg:text-6xl text-center">Show support</h2>
            <div class="flex py-6 xl:p-12 text-3xl">
              <div class=" text-center">
                <div>Encourage and support the work of you favorite writers and creators,
                  <span class="font-semibold">with tips of any amount, and without fees. </span>
                </div>
              </div>
            </div>
          </span>

          <!-- Web3 -->
          <!-- <span v-if="activeDescription === 'web3'">
            <div>
              <img
                src="/brands/desmos/logo.svg"
                class="mx-auto w-32"
              >
            </div>
            <div class="flex py-6 xl:p-12 text-3xl">
              <div class="text-gray-dark text-center">
                <div><span class="font-semibold">Scripta is built on top of Desmos</span>, a blockchain for the next generation of social networks.</div>
                <div class="mt-2 italic">But what does actually mean?</div>
                <div class="pt-6 font-serif font-bold">That you own your <u>data</u>, you own your <u>content</u>, you own your <u>identity</u>.</div>
              </div>
            </div>
          </span> -->
        </div>
        <div class="md:flex-1 my-auto col-span-12 lg:col-span-6 md:px-10 order-1 2xl:order-last mx-auto">
          <div class="text-primary-dark py-10">
            <h3 class="font-extralight text-6xl text-center lg:text-7xl py-8 lg:-skew-x-12 lg:-skew-y-3 underline decoration-orange text-background 2xl:text-primary-text">
              It's time to evolve.
            </h3>
            <p class="pt-6 text-primary-text text-xl">
              <!-- A <span class="tracking-tighter text-sm">little</span> step into Web3, a <span class="font-extrabold tracking-wider text-2xl">giant</span> leap for mankind. -->
            </p>
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
            <!-- <div class="pt-6">
              <a
                href=""
                class="text-2xl font-semibold"
              >Learn More -></a>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
const activeDescription = ref("create");
function showDescription /*  */(id: string) {
  this.activeDescription = id;
}
</script>
