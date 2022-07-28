<template>
  <AuthCard>
    <template #card>
      <AuthContentCard class="flex-row items-center justify-center py-32 md:py-16 xl:py-36">
        <div class="flex flex-col items-center justify-center gap-y-8">
          <div class="px-8">
            <img
              src="/icons/linear/tick-circle.svg"
              class="h-32 object-contain"
            >
          </div>
          <p class="text-2xl font-bold tracking-widest text-primary-text-light">
            Success
          </p>
          <AuthStatusButton
            class="bg-primary"
            @click="onContinueAction"
          >
            Continue
          </AuthStatusButton>
        </div>
      </AuthContentCard>
    </template>
  </AuthCard>
</template>

<script setup lang="ts">
function onContinueAction () {
  navigateTo("/profile");
}
onMounted(() => {
  if (process.client) {
    setTimeout(() => {
      onContinueAction();
    }, 3000);
  }
});
</script>
