<template>
  <div>
    <slot>
      <button @click="$emit('editPage', -1)">
        <div class="flex">
          <img :src="'/icons/bold/arrow-left.svg'">
          <span class="font-semibold">Back</span>
        </div>
      </button>
    </slot>
  </div>
</template>
