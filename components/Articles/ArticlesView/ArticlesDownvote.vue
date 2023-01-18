<template>
  <NuxtLayout name="tooltip" :title="'Downvote'" :position="'Top'">
    <div
      class="group-hover:text-danger"
      :class="{'text-danger': props.reacted}"
    >
      <span v-if="props.reacted">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          version="1.1"
          id="svg275"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:svg="http://www.w3.org/2000/svg"
        >
          <path
            d="m 12.0001,6 h 2.67 c 1.597237,0 2.74041,0.5472059 3.30929,1.435993 0.610026,0.9530714 0.559679,2.2989228 -0.29929,3.784007 l -1.34,2.31 -1.34,2.31 c -1.66,2.87 -4.37,2.87 -6.03005,0 l -1.34,-2.31 -1.34,-2.31 C 5.5828797,9.9748597 5.4366141,8.8275953 5.7687766,7.9276447 6.2022358,6.7532442 7.4504214,6 9.33005,6 Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
            id="path273"
            sodipodi:nodetypes="cssccccccssc"
          />
          <path
            fill="currentColor"
            d="M 5.7659096,9.0315575 10.154124,17.297729 13.31772,17.425293 18.700937,9.2356605 17.297729,6.5823216 6.8119374,6.3527057 Z"
            id="path505"
          />
        </svg>

      </span>
      <span v-else>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.0001 6H14.6701C17.9801 6 19.3401 8.35 17.6801 11.22L16.3401 13.53L15.0001 15.84C13.3401 18.71 10.6301 18.71 8.97005 15.84L7.63005 13.53L6.29005 11.22C4.66005 8.35 6.01005 6 9.33005 6H12.0001Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

      </span>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
interface Props {
  reacted: boolean;
}
const props = defineProps<Props>();
</script>
