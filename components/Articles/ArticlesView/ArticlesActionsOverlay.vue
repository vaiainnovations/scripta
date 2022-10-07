<script lang="ts" setup>
import { PostExtended } from "~~/types/PostExtended";

interface Props {
  article: PostExtended;
}
const props = defineProps<Props>();

const isOverlayOpen = ref(false);
const isReportOverlayOpen = ref(false);

function toggleOverlay () {
  isOverlayOpen.value = !isOverlayOpen.value;
}
function toggleReportOverlay () {
  isReportOverlayOpen.value = !isReportOverlayOpen.value;
}

function addReport () {
  toggleOverlay();
  toggleReportOverlay();
}
</script>

<template>
  <div>
    <div class="relative inline-block text-left">
      <div>
        <button class="bg-white" @click="toggleOverlay">
          <img src="/icons/linear/dots.svg">
        </button>
      </div>
      <div v-if="isOverlayOpen" class="origin-top-right absolute right-0 mt-1 rounded-2xl shadow-lg bg-background-alt dark:bg-gray-800 ring-opacity-5 z-10">
        <div class="py-1" role="menu" aria-orientation="vertical">
          <!-- Report -->
          <div class="block rounded-lg bg-background/50 hover:bg-background mx-2 my-1.5 py-2 px-2 text-md text-primary-text/60 hover:text-primary-text cursor-pointer select-none" role="menuitem" @click="addReport()">
            <span class="flex w-20">
              <img src="/icons/bold/info-circle.svg" class="w-6">
              <span class="my-auto pl-2">
                Report
              </span>
            </span>
          </div>
        </div>
      </div>
      <ReportsActionOverlay v-if="isReportOverlayOpen" :post-id="(props.article.id as any)" :content="props.article.text + '. ' + props.article.subtitle" :author="props.article.author" @close-report-overlay="toggleReportOverlay" />
    </div>
  </div>
</template>
