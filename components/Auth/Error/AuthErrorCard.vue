<template>
  <AuthCard>
    <template #card>
      <AuthContentCard class="flex-row items-center justify-center py-32 md:py-16 xl:py-36">
        <div class="flex flex-col items-center justify-center gap-y-8">
          <div class="px-8">
            <img
              src="/icons/linear/close-circle.svg"
              class="h-32 object-contain"
            >
          </div>
          <p class="text-2xl font-bold tracking-widest text-primary-text-light">
            Ops, something went wrong
          </p>
          <AuthStatusButton class="bg-primary" @click="onErrorAction">
            Go Back
          </AuthStatusButton>
        </div>
      </AuthContentCard>
    </template>
  </AuthCard>
</template>

<script setup lang="ts">
async function onErrorAction () {
  await navigateTo("");
}
</script>
