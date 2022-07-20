<template>
  <div class="bg-background w-full flex flex-col items-center justify-start px-4 gap-y-3.5 py-3.5 lg:px-32 lg:py-20 lg:gap-y-2.5">
    <div class="grid grid-cols-2 self-start justify-start w-full items-center">
      <AuthButtonsBackRouting class="col-span-2 lg:col-span-1" />
      <!-- Last edit -->
      <p class="text-primary-text-light text-sm col-span-2 lg:col-span-1 text-right">
        Last edit: 1 June 10:23
      </p>
    </div>
    <!-- Tags -->
    <ArticlesCreateTags />
    <!-- Input form -->
    <ArticlesCreateInput />
    <!-- Submit buttons -->
    <ArticlesCreateButtons />
  </div>
</template>
