<template>
  <AuthCard>
    <template #card>
      <AuthKeplrDownloadCard v-if="count == 0" />
      <AuthKeplrQRCard v-else />
    </template>
    <template #buttons>
      <AuthButtonsBack @edit-page="editCount">
        <AuthButtonsBackRouting v-if="count == 0" to="/auth" />
      </AuthButtonsBack>
      <AuthButtonsNext v-if="count < maxPages" @edit-page="editCount" />
    </template>
  </AuthCard>
</template>

<script setup lang="ts">
const maxPages = 1;
const count = ref(0);

function editCount (n:number) {
  if (n > 0 && count.value < maxPages) {
    count.value += n;
  } else if (n < 0 && count.value > 0) {
    count.value += n;
  }
}
</script>
