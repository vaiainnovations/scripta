<template>
  <div>
    <NuxtLayout name="custom">
      <div class="p-4 sm:px-10 md:px-16 lg:mx-16 xl:mx-32">
        <section class="py-8">
          <TrendingTags />
        </section>
        <section class="py-8">
          <TrendingArticles :n="16" />
        </section>
      </div>
      <section class="py-8 px-4 md:px-6 lg:px-8 2xl:px-32">
        <LatestArticles :n="24" />
      </section>
    </NuxtLayout>
  </div>
</template>
