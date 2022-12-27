<template>
  <div>
    <NuxtLayout name="custom">
      <div class="p-4 sm:px-10 md:px-16 lg:mx-20 xl:mx-64">
        <section class="py-8">
          <TrendingTags />
        </section>
        <section class="py-8">
          <TrendingArticles :n="12" />
        </section>
      </div>
    </NuxtLayout>
  </div>
</template>
