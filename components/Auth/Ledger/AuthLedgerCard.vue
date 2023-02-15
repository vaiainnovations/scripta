<template>
  <AuthCard>
    <template #card>
      <AuthLedgerSelectAppCard />
    </template>
    <template #buttons>
      <AuthButtonsBack @edit-page="editCount">
        <AuthButtonsBackRouting v-if="count == 0" to="/auth" />
      </AuthButtonsBack>
    </template>
  </AuthCard>
</template>

<script setup lang="ts">
const maxPages = 0;
const count = ref(0);

function editCount (n: number) {
  if (n > 0 && count.value < maxPages) {
    count.value += n;
  } else if (n < 0 && count.value > 0) {
    count.value += n;
  }
}
</script>
