<template>
  <div>
    <slot>
      <button @click="$emit('editPage', 1)">
        <span class="font-bold">Next</span> &#9654;
      </button>
    </slot>
  </div>
</template>
