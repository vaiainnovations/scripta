<template>
  <div class="space-y-8 md:space-y-1">
    <slot name="card" />
    <div class="flex w-full flex-row justify-between">
      <slot name="buttons" />
    </div>
  </div>
</template>
