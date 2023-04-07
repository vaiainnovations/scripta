<template>
  <div class="h-28 my-2 overflow-hidden xl:mx-2 hover:bg-background/60 rounded-lg py-2 pl-2.5 xl:pl-0 group">
    <div class="w-full flex h-24">
      <div class="w-1/4 p-1 my-auto">
        <ImageWrapper
          :img-url="props.post.image ||'/img/author_pic.png'"
          :img-class="'w-full pr-1 m-auto object-cover h-20 aspect-video rounded-lg'"
        />
      </div>
      <div class="w-3/4 p-1 flex flex-col">
        <div class="flex-1">
          <p class="leading-tight group-hover:text-primary-text-light" :class="props.post.text.length + props.post.subtitle.length >= 100 ? 'block group-hover:hidden text-base' : ' text-lg'">
            {{ props.post.text.length<=100? props.post.text : props.post.text.substring(0,100) + '...' }}
          </p>
          <p class="h-full overflow-hidden text-sm font-light text-primary-text-light" :class="props.post.text.length + props.post.subtitle.length >= 100 ? 'hidden group-hover:block' : ''">
            {{ props.post.subtitle.length<=100? props.post.subtitle : props.post.subtitle.substring(0,100) + '...' }}
          </p>
        </div>
        <div v-if="props.post.author.dtag" class="w-full flex mt-1">
          <img
            :src="props.post.author.pictures.profile"
            onerror="this.onerror=null;this.src='/img/author_pic.png'"
            class="h-5 w-5 object-cover rounded-full mx-1"
            loading="lazy"
          >
          <p class="text-sm font-light my-auto truncate mx-1">
            {{ props.post.author.nickname || props.post.author.dtag }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PostExtended } from "~~/types/PostExtended";

interface Props {
  post: PostExtended;
}

const props = defineProps<Props>();
</script>
