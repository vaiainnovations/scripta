<template>
  <div class="bg-background min-h-screen w-full flex flex-col items-center justify-start px-4 gap-y-3.5 py-3.5 lg:px-32 lg:py-20 lg:gap-y-2.5">
    <div class="grid grid-cols-2 self-start justify-start w-full items-center">
      <ArticlesEditorButtonBackRouting class="col-span-2 lg:col-span-1" />
    </div>
    <!-- Tags -->
    <ArticlesCreateTags class="pt-6" />
    <!-- Input form -->
    <ArticlesCreateInput />
    <!-- Submit buttons -->
    <ArticlesEditButtons class="mt-6" />
  </div>
</template>

<script setup lang="ts">

</script>
