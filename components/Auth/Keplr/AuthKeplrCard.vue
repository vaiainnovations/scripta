<template>
  <AuthCard>
    <template #card>
      <AuthKeplrDownloadCard v-if="count == 0" />
      <AuthKeplrConnectCard v-else />
    </template>
    <template #buttons>
      <AuthButtonsBack @edit-page="editCount">
        <AuthButtonsBackRouting v-if="count == 0" to="/auth" />
      </AuthButtonsBack>
      <!-- Let the user proceed only if Keplr is installed -->
      <AuthButtonsNext v-if="count < maxPages && useKeplrStore().isAvailable" @edit-page="editCount" />
    </template>
  </AuthCard>
</template>

<script setup lang="ts">
import { useKeplrStore } from "~~/core/store/wallet/KeplrStore";
const maxPages = 1;
const count = ref(0);

// If Leap is available, skip the download page
onMounted(() => {
  if (useKeplrStore().isInstalled) {
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
