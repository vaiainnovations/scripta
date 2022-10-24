<template>
  <span v-if="!isEditing">
    <div class="lg:relative">
      <div
        v-if="!readOnly"
        class="absolute w-full flex flex-col items-end justify-start mt-7 lg:mt-0 right-8 lg:right-2 gap-y-32 lg:gap-y-36"
      >
        <NuxtLink to="settings">
          <img
            class="w-5 h-5 cursor-pointer"
            src="/icons/bold/setting-2.svg"
          >
        </NuxtLink>
        <img
          class="w-4 h-4 cursor-pointer"
          src="/icons/broken/edit.svg"
          @click="isEditing = true"
        >
      </div>
      <ProfileUserView />
    </div>
  </span>
  <span v-else>
    <ProfileUserEdit @user-edited="isEditing=false" />
  </span>
</template>

<script setup lang="ts">
interface Props {
  readOnly?: boolean;
}

const props = defineProps<Props>();
const readOnly = ref(props.readOnly ?? false);
const isEditing = ref(false);
</script>
