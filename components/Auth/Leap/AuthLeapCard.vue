<template>
  <AuthCard>
    <template #card>
      <AuthLeapDownloadCard v-if="count == 0" />
      <AuthLeapConnectCard v-else />
    </template>
    <template #buttons>
      <AuthButtonsBack @edit-page="editCount">
        <AuthButtonsBackRouting v-if="count == 0" to="/auth" />
      </AuthButtonsBack>
      <!-- Let the user proceed only if Leap is installed -->
      <AuthButtonsNext v-if="count < maxPages && useLeapStore().isAvailable" @edit-page="editCount" />
    </template>
  </AuthCard>
</template>

<script setup lang="ts">
import { useLeapStore } from "~~/core/store/wallet/LeapStore";
const maxPages = 1;
const count = ref(0);

// If Leap is available, skip the download page
onMounted(() => {
  if (useLeapStore().isInstalled) {
    editCount(1);
  }
});

function editCount (n: number) {
  if (n > 0 && count.value < maxPages) {
    count.value += n;
  } else if (n < 0 && count.value > 0) {
    count.value += n;
  }
}
</script>
