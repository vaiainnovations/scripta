<template>
  <AuthCard>
    <template #cards>
      <AuthContentCard class="flex-row justify-center items-center py-32 md:py-16 xl:py-36">
        <div class="flex flex-col justify-center items-center gap-y-8">
          <div class="px-8">
            <img src="https://www.nicepng.com/png/full/362-3624869_icon-success-circle-green-tick-png.png" class="h-32 object-contain">
          </div>
          <p class="text-primary-text-light tracking-widest text-2xl font-bold">
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
