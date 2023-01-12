<template>
  <div class="px-4 md:px-10 xl:px-20 2xl:px-40 py-10 bg-background-alt">
    <div class="grid grid-cols-12 md:gap-10">
      <div class="col-span-12 xl:col-span-9 order-2 xl:order-1">
        <TrendingArticles :n="12" />
      </div>
      <div class="col-span-12 xl:col-span-3 order-1 xl:order-2 mb-8">
        <TrendingTags />
      </div>
      <div class="col-span-12 py-6 order-2">
        <LatestArticles :n="12" />
      </div>
    </div>
  </div>
</template>
