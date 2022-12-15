<template>
  <div>
    <NavBar />
    <main class="bg-background-alt flex flex-col w-full gap-y-5 lg:flex-row lg:h-screen lg:overflow-hidden pt-8 md:pt-16">
      <div class="gap-y-14 lg:gap-y-0 lg:justify-evenly lg:w-1/4 2xl:w-1/5 py-14 lg:h-full" :class="{'hidden md:block': !isProfileHome}">
        <div class="flex flex-col h-full">
          <div class="flex-grow">
            <ProfileUserView />
          </div>
          <div class="flex-none bottom-0">
            <ProfileActions />
            <ProfileAirdrop />
            <ProfileBalance class="pt-4" />
          </div>
        </div>
      </div>
      <div class="bg-[#FFFFFF] gap-y-7 items-center lg:w-3/4 2xl:w-4/5 lg:bg-background lg:overflow-y-auto">
        <ProfileNavigation v-if="hasNavigation" :props="props" />
        <div class="lg:px-32 mb-10" :class="{'lg:my-20 md:pt-20 md:pt-5': hasNavigation}">
          <slot />
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>

export interface ProfileNavigationProps {
  title?: string;
  icon?: string;
  to?: string;
}

const props = defineProps<ProfileNavigationProps>();
const hasNavigation = (props.title || props.to || props.icon);
const isProfileHome = useRoute().path === "/profile";
</script>
