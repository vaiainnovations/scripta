<template>
  <div>
    <button class="group p-1.5 rounded-full hover:bg-background-alt/40" @click="handleReaction(':up:')">
      <ArticlesUpvote :reacted="userReaction?.code === ':up:'" />
    </button>
    <button class="group p-1.5 rounded-full hover:bg-background-alt/40" @click="handleReaction(':down:')">
      <ArticlesDownvote :reacted="userReaction?.code === ':down:'" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ArticleReaction } from "~~/core/store/ReactionStore";
import { PostExtended } from "~~/types/PostExtended";

interface Props {
  article: PostExtended;
}
const props = defineProps<Props>();

const userReaction = ref(null);
const previousReaction = ref(null);
try {
  await getReactions(props.article.id).then((reaction: ArticleReaction) => { userReaction.value = reaction; previousReaction.value = reaction; });
} catch (e) {
  // no reaction or error
  console.error(e);
}

async function getReactions (postId: any): Promise<ArticleReaction> {
  const { $useReaction } = useNuxtApp();
  return await $useReaction().getUserPostReaction(postId);
}

function handleReaction (code: string) {
  const { $useReaction } = useNuxtApp();
  const reaction = $useReaction().getReaction(code);
  if (code === userReaction.value?.code) {
    userReaction.value = null;
  } else {
    userReaction.value = reaction;
  }
  console.log(previousReaction.value);
  if (previousReaction.value && userReaction.value === null) {
    $useReaction().removeReaction(props.article.id, previousReaction.value.reactionId);
  } else {
    $useReaction().addReaction(props.article.id, userReaction.value);
  }
}

</script>
