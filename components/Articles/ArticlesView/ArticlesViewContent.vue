<template>
  <div class="flex flex-col gap-y-3">
    <p class="text-3xl font-bold text-primary-text lg:text-5xl xl:text-6xl">
      {{ props.title }}
    </p>
    <p class="text-xl font-medium text-primary-text-light lg:text-2xl xl:text-3xl">
      {{ props.subtitle }}
    </p>
    <ArticlesViewUser :user="props.user" />
    <div class="pt-7">
      <MarkDownEditor :read-only="true" :content="props.content" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface UserType {
  name: string,
  date: string,
  image: string
}

interface Props {
  title: string
  subtitle: string
  content: string
  user: UserType
}

const props = defineProps<Props>();
</script>
