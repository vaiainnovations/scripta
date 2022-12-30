<template>
  <section class="min-h-[70vh] bg-background flex">
    <div class="flex-grow bg-gradient-to-b from-gray-100 to-white my-auto xl:pb-16">
      <div class="px-4 pt-10 pb-5 mx-auto text-left md:text-center md:w-3/4 lg:w-2/4">
        <h1 class="mb-6 text-6xl font-extrabold font-serif tracking-tight md:mb-6 md:leading-tight text-center">
          Earn from your words
        </h1>
      </div>
      <div class="">
        <div class="grid grid-cols-12 px-5 md:px-20">
          <!-- Create Wallet -->
          <div class="col-span-12 lg:col-span-5 xl:col-span-3 3xl:col-span-2 m-8 shadow-4xl hover:shadow-5xl rounded-md rounded-br-none bg-background-alt">
            <div class="float-right bg-background rounded-full h-10 w-10 text-white relative -mt-5 -mr-6 bg-[#000000]">
              <p class="text-center p-1.5 text-xl font-bold">
                1
              </p>
            </div>
            <div class="p-8">
              <img
                src="/icons/bold/key.svg"
                class="p-4 mx-auto bg-background rounded-2xl my-4"
              >
              <h3 class="text-2xl py-2 font-serif text-center">
                Create your Account
              </h3>
              <p class="text-center pt-3 text-lg font-light">
                Set up your favourite wallet, and create your decentralized account
              </p>
              <NuxtLink to="/auth">
                <button class="w-full py-2 mt-4 text-lg font-semibold text-white bg-primary rounded-md">
                  Start Now
                </button>
              </NuxtLink>
            </div>
          </div>

          <div class="my-auto mx-auto hidden lg:block">
            <!-- <img src="/icons/linear/arrow-right.svg"> -->
          </div>

          <!-- Write Article -->
          <div class="col-span-12 lg:col-span-5 xl:col-span-3 3xl:col-span-2 m-8 shadow-4xl hover:shadow-5xl rounded-md rounded-br-none bg-background-alt">
            <div class="float-right bg-background rounded-full h-10 w-10 text-white relative -mt-5 -mr-6 bg-[#000000]">
              <p class="text-center p-1.5 text-xl font-bold">
                2
              </p>
            </div>
            <div class="p-8">
              <img
                src="/icons/bold/edit.svg"
                class="p-4 mx-auto bg-background rounded-2xl my-4"
              >
              <h3 class="text-2xl py-2 font-serif text-center">
                Write an article
              </h3>
              <p class="text-center pt-3 text-lg font-light">
                Write an article, a story or a tutorial that you want to share with the world
              </p>
            </div>
          </div>

          <div class="my-auto mx-auto hidden lg:block">
            <!--  <img src="/icons/linear/arrow-right.svg"> -->
          </div>

          <!-- Get Feedback -->
          <div class="col-span-12 lg:col-span-5 xl:col-span-3 3xl:col-span-2 m-8 shadow-4xl hover:shadow-5xl rounded-md rounded-br-none bg-background-alt">
            <div class="float-right bg-background rounded-full h-10 w-10 text-white relative -mt-5 -mr-6 bg-[#000000]">
              <p class="text-center p-1.5 text-xl font-bold">
                3
              </p>
            </div>
            <div class="p-8">
              <img
                src="/icons/bold/people.svg"
                class="p-4 mx-auto bg-background rounded-2xl my-4"
              >
              <h3 class="text-2xl py-2 font-serif text-center">
                Get Feedback
              </h3>
              <p class="text-center pt-3 text-lg font-light">
                Get response from the readers with comments and upvotes
              </p>
            </div>
          </div>
          <div class="my-auto mx-auto hidden lg:block">
            <!--  <img src="/icons/linear/arrow-right.svg"> -->
          </div>

          <!-- Earn -->
          <div class="col-span-12 lg:col-span-5 xl:col-span-3 3xl:col-span-2 m-8 shadow-4xl hover:shadow-5xl rounded-md rounded-br-none bg-background-alt">
            <div class="float-right bg-background rounded-full h-10 w-10 text-white relative -mt-5 -mr-6 bg-[#000000]">
              <p class="text-center p-1.5 text-xl font-bold">
                4
              </p>
            </div>
            <div class="p-8">
              <img
                src="/icons/bold/status-up.svg"
                class="p-4 mx-auto bg-background rounded-2xl my-4"
              >
              <h3 class="text-2xl py-2 font-serif text-center unde">
                Earn
              </h3>
              <p class="text-center pt-3 text-lg font-light">
                Earn from user tips and from the reward system
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
