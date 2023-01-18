<template>
  <div class="group flex relative">
    <span
      class="group-hover:opacity-100 transition-opacity bg-[#000000]/75 text-gray-light px-1 text-xs text-gray-100 rounded-md absolute
    opacity-0 mx-auto z-40 py-1 px-2"
      :class="positionClass"
    >{{ props.title }}</span>
    <slot />
  </div>
</template>

<script lang="ts" setup>
export interface ProfileNavigationProps {
  title: string;
  position: "Top" | "Bottom";
}

const props = defineProps<ProfileNavigationProps>();
const position = props.position || "Bottom";

let positionClass = "";
switch (position) {
case "Top":
  positionClass = "-translate-y-full mb-4";
  break;

case "Bottom":
  positionClass = "translate-y-1/2 mt-2";
  break;

default:
  break;
}
</script>
