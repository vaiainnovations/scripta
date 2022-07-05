<template>
  <AuthCard>
    <template #cards>
      <AuthContentCard class="flex-row items-center justify-center py-32 md:py-16 xl:py-36">
        <div class="flex flex-col items-center justify-center gap-y-8">
          <div class="px-8">
            <img
              src="/icons/linear/tick-circle.svg"
              class="h-32 object-contain"
            >
          </div>
          <p class="text-2xl font-bold tracking-widest text-primary-text-light">
            Success
          </p>
          <AuthStatusButton class="bg-primary">
            Continue
          </AuthStatusButton>
        </div>
      </AuthContentCard>
    </template>
  </AuthCard>
</template>
