<template>
  <!-- Container to set the position of the tooltip -->
  <div class="fixed bottom-30 mx-auto h-auto max-h-screen w-screen px-2 pt-24 md:pt-20 z-50">
    <!-- Tooltip box with relative position -->
    <div class="relative mx-auto h-5/6 w-full overflow-scroll rounded-2xl bg-background px-4 shadow-2xl lg:w-3/4 xl:w-3/5">
      <!-- Flex container on mobile devices (< 768 px), grid with seven columns for bigger ones  -->
      <div class="flex w-full flex-col place-content-center items-start gap-y-3 py-4 px-2 md:grid md:grid-cols-7 md:gap-x-6 md:px-12">
        <!-- Text on top of the results -->
        <div class="mx-auto col-span-7">
          <!-- md:col-span-4 md:col-start-1 -->
          <p class="text-center text-xl font-bold">
            Search Results
          </p>
        </div>
        <!-- Articles found by the search; on mobile devices (< 768 px) it's last shown -->
        <div v-if="useSearchStore().articleResults.length > 0" class="order-last flex flex-col gap-y-2 md:order-none col-span-5 col-start-2">
          <!-- md:col-span-4 md:col-start-1 -->
          <div class="overflow-visible max-h-[80vh]">
            <SearchArticleCard
              v-for="result in useSearchStore().articleResults"
              :key="result.externalId"
              :post="result"
              class="my-2"
            />
          </div>
        </div>
        <!-- Authors found by the search; on mobile devices (< 768 px) it's a grid with two columns; a flex container for bigger ones -->
        <!-- <div
          v-if="false"
          class="grid w-full grid-cols-2 place-content-center gap-y-2 gap-x-5 md:col-span-3 md:col-start-5 md:flex md:flex-col md:items-center md:justify-start md:gap-y-2 md:px-4"
        >
          // Text shown only on bigger devices (>= 768 px)
          <p class="hidden text-center text-base font-bold md:block lg:text-lg">
            User results
          </p>
          <SearchAuthorCard v-for="result in authorResults" :key="result.id" :content="result.content" />
        </div> -->
        <span
          v-else
          class="text-center col-span-7"
        >
          No Results.
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useSearchStore } from "~~/core/store/SearchStore";
</script>
