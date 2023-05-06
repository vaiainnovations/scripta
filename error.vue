<template>
  <div class="bg-background min-h-screen">
    <NavBar />
    <section class="px-4 py-32 md:py-60 mx-auto max-w-7xl">
      <div class="grid items-center w-full grid-cols-1 gap-10 mx-auto md:w-4/5 lg:grid-cols-2 xl:gap-32 bg-background-alt p-4 md:p-8 lg:p-0 lg:pl-20 rounded-2xl">
        <div>
          <p class="mb-2 text-sm font-semibold tracking-wide text-gray uppercase">
            Error {{ props.error.statusCode }}
          </p>
          <h1 class="mb-4 text-6xl font-extrabold leading-tight tracking-tight text-left text-gray-dark md:text-5xl underline">
            {{ props.error.data ? props.error.message : "Page Not Found" }}
          </h1>
          <p class="my-5 text-base text-left text-gray-800 md:text-2xl">
            {{ props.error.data }}
          </p>
          <div class="py-8">
            <a
              href="/"
              class="w-full mb-2 p-3 bg-background hover:bg-background/70 text-primary-text rounded-lg sm:mb-0"
            >Back to homepage</a>
            <a
              href="mailto:support@scripta.network"
              class="w-full mb-2 p-4 hover:underline text-primary-text/70"
            >Contact us</a>
          </div>
        </div>
        <div>
          <div class="w-full h-full py-48 bg-background-alt rounded-xl" src="" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { NuxtError } from "nuxt/app";

/* const defaultError = createError({
  statusCode: 404,
  message: "Page not found"
}); */

interface Props {
  error: NuxtError;
}

const props = defineProps<Props>();
/* const handleError = () => clearError({ redirect: "/" }); */
</script>
