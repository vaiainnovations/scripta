<template>
  <div class="space-y-8 md:space-y-1">
    <slot name="card" />
    <div class="flex flex-row justify-between w-full">
      <slot name="buttons" />
    </div>
  </div>
</template>
