<template>
  <div class="flex flex-col gap-y-3">
    <div class="w-full md:min-h-[20rem] mx-auto rounded-3xl shadow-sm bg-[#FFFFFF]/70">
      <div class="grid grid-cols-12 p-4 md:p-10">
        <div class="col-span-12 flex flex-wrap flex-row items-center justify-start gap-1.5 md:gap-2">
          <ArticlesViewTag
            v-for="tag in props.tags"
            :key="tag.i"
            :content="tag.content"
            class="max-w-fit mb-0.5"
          />
        </div>
        <div class="col-span-12 md:col-span-7">
          <div class="flex flex-col h-full">
            <div class="flex-1">
              <p class="text-2xl font-medium text-primary-text lg:text-4xl pt-6">
                {{ props.title }}
              </p>
              <p
                v-if="props.title.length <= 70"
                class="text-lg font-light text-primary-text-light lg:text-xl 2xl:text-2xl pt-1"
              >
                {{ props.subtitle }}
              </p>
            </div>
            <div class="bottom-0">
              <ArticlesViewUser
                :address="props.address"
                :date="props.date"
              />
            </div>
          </div>
        </div>
        <div class="col-span-12 md:col-span-5 m-auto p-4 w-full">
          <img
            :src="props.preview"
            class="rounded-xl object-cover min-h-[8rem] max-h-64 aspect-video md:aspect-auto w-full select-none pointer-events-none"
          >
        </div>
      </div>
    </div>
    <p
      v-if="props.title.length > 70"
      class="italic text-center text-lg font-light text-primary-text-light lg:text-xl 2xl:text-2xl pt-1"
    >
      {{ props.subtitle }}
    </p>
    <div
      v-if="props.address === (useAccountStore().address || '')"
      class="w-full text-right"
    >
      <div class="relative inline-flex text-gray-dark">
        <NuxtLink
          :to="`/edit/${props.externalId}`"
          class="flex"
        >
          <img
            src="/icons/broken/edit.svg"
            class="mr-1 h-5 w-5 my-auto"
          > Edit
        </NuxtLink>
      </div>
    </div>
    <div class="pt-7 lg:pt-0 mx-2 md:mx-5 lg:mx-14 xl:mx-16 2xl:mx-32">
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
  preview: string;
  tags: any;
}

const props = defineProps<Props>();
</script>
