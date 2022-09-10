<template>
  <section>
    <div
      class="flex select-none cursor-pointer hover:bg-background-alt/50 p-1.5 px-3 rounded-xl"
      @click="toggleOverlay()"
    >
      <img
        src="/icons/bold/send-2.svg"
        class="h-5 w-5"
      >
      <p class="text-sm font-medium ml-2">
        Tip
      </p>
    </div>

    <ArticlesTipsOverlay
      v-if="isOverlayOpen"
      :author="props.author"
      @close-tips-overlay="toggleOverlay()"
    />
  </section>
</template>

<script lang="ts" setup>
interface Props {
  author: string;
}
const props = defineProps<Props>();
const isOverlayOpen = ref(false);

function toggleOverlay () {
  isOverlayOpen.value = !isOverlayOpen.value;
}
</script>
