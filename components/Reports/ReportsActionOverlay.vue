<script lang="ts" setup>
import Long from "long";
import { Author } from "~~/types/Author";

interface Props {
  postId: number;
  content: string;
  author: Author;
}
const props = defineProps<Props>();

const emit = defineEmits(["closeReportOverlay"]);
const { $useReport } = useNuxtApp();
const reasons = $useReport().registeredReasons;
const selectedReason = ref(reasons[0]);
const reasonText = ref("");

function addReport () {
  const { $useReport } = useNuxtApp();
  $useReport().addPostReport(
    Long.fromNumber(props.postId),
    [selectedReason.value.id],
    reasonText.value
  );
  emit("closeReportOverlay");
}

function selectReason (reason) {
  selectedReason.value = reason;
}
</script>

<template>
  <div>
    <div class="w-screen top-0 left-0 h-screen fixed flex align-middle items-center z-10">
      <div class="w-full sm:w-1/2 md:w-1/3 xl:w-1/4 p-2 mx-auto rounded-2xl shadow-xl bg-background-alt dark:bg-gray-800 ring-opacity-5 z-30 m-2">
        <div
          class="py-1 p-5"
          role="menu"
          aria-orientation="vertical"
        >
          <div class=" text-center mt-2">
            <img
              src="/icons/bold/info-circle.svg"
              class="w-12 mx-auto"
            >
            <h2 class="text-xl py-2 text-primary-text/70">
              Report
            </h2>
            <div class="p-1">
              You are reporting the following content written by <span class="font-semibold">@{{ props.author.dtag || props.author.address }}</span>
              <div class="m-3 p-2 rounded-md bg-background">
                {{ props.content }}
              </div>
            </div>
          </div>
          <!-- Report Reasons-->
          <div class="p-4 mx-auto">
            <p>Why are you submitting this report?</p>
            <div
              v-for="reason in reasons"
              :key="reason.id"
              class="block rounded-lg bg-background/50 hover:bg-background mx-2 my-1.5 py-2 px-2 text-md text-primary-text/60 hover:text-primary-text cursor-pointer select-none"
              role="menuitem"
              @click="selectReason(reason)"
            >
              <span class="flex">
                <img
                  v-if="selectedReason.id === reason.id"
                  src="/icons/bold/circle-select.svg"
                  class="w-4"
                >
                <img
                  v-else
                  src="/icons/linear/circle-select.svg"
                  class="w-4"
                >
                <span class="my-auto pl-2">
                  {{ reason.title }}
                </span>
              </span>
            </div>
          </div>

          <div
            v-if="selectedReason.hasText"
            class="p-4"
          >
            <textarea
              v-model="reasonText"
              maxlength="200"
              placeholder="Explain the reason of the report"
              class="w-full p-1"
            />
          </div>

          <button
            class="w-full p-1.5 bg-primary-light/70 hover:bg-primary-light rounded-lg text-background-alt"
            @click="addReport()"
          >
            Submit Report
          </button>
        </div>
      </div>
      <div
        class="w-screen top-0 left-0 h-screen fixed bg-background-alt/60 flex align-middle items-center z-10"
        @click="emit('closeReportOverlay')"
      />
    </div>
  </div>
</template>
