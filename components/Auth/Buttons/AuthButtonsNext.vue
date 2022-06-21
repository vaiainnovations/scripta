<template>
  <div>
    <slot>
      <button @click="$emit('editPage', 1)">
        <div class="flex">
          <span class="font-semibold">Next</span>
          <img :src="'/icons/bold/arrow-right.svg'">
        </div>
      </button>
    </slot>
  </div>
</template>
