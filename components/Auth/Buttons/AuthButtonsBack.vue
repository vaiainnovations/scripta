<template>
  <div>
    <slot>
      <button @click="$emit('editPage', -1)">
        &#9664; <span class="font-bold">Back</span>
      </button>
    </slot>
  </div>
</template>
