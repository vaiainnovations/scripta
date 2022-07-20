<template>
  <AuthCard>
    <template #card>
      <AuthContentCard class="flex-row items-center justify-center py-32 md:py-16 xl:py-36">
        <div class="flex flex-col items-center justify-center gap-y-8">
          <div class="px-8 py-10">
            <img
              src="/svg/spinner/dots.svg"
              class="h-8 object-contain"
            >
          </div>
          <p class="pt-10 text-2xl font-bold tracking-widest text-primary-text-light">
            Loading
          </p>
        </div>
      </AuthContentCard>
    </template>
  </AuthCard>
</template>
