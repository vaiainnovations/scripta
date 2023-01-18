<template>
  <div class="flex flex-col gap-y-3">
    <p class="text-3xl font-semibold text-primary-text lg:text-5xl 2xl:text-6xl pt-6">
      {{ props.title }}
    </p>
    <p class="text-lg font-medium text-primary-text-light lg:text-2xl 2xl:text-3xl">
      {{ props.subtitle }}
    </p>
    <ArticlesViewUser
      :address="props.address"
      :date="props.date"
    />
    <div
      v-if="props.address === (useAccountStore().address || '')"
      class="w-full text-right"
    >
      <div class="relative inline-flex text-gray-dark">
        <NuxtLink :to="`/edit/${props.externalId}`" class="flex">
          <img
            src="/icons/broken/edit.svg"
            class="mr-1 h-5 w-5 my-auto"
          > Edit
        </NuxtLink>
      </div>
    </div>
    <div class="pt-7 lg:pt-0">
      <MarkDownEditor
        :read-only="true"
        :content="props.content"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAccountStore } from "~~/core/store/AccountStore";

interface Props {
  externalId: string;
  title: string;
  subtitle: string;
  content: string;
  address: string;
  date: Date;
}

const props = defineProps<Props>();
</script>
