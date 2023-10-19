<template>
  <div>
    <NavBar />
    <main class="bg-background-alt flex flex-col w-full gap-y-5 lg:flex-row lg:h-screen pt-4 lg:pt-16">
      <div
        class="gap-y-14 lg:gap-y-0 lg:justify-evenly lg:w-1/4 2xl:w-1/5 py-14 lg:h-full overflow-y-auto"
        :class="{'hidden lg:block': !isProfileHome || !useConfigStore().features.follow}"
      >
        <span v-if="!isLoading">
          <div class="flex flex-col h-full">
            <div class="flex-grow">
              <ProfileUserView />
            </div>
            <div class="flex-none bottom-0">
              <ProfileActions />
              <ProfileAirdrop />
              <ProfileBalance />
            </div>
          </div>
        </span>
        <span v-if="isLoading">
          <SkeletonProfileSidebar />
        </span>
      </div>
      <div class="bg-[#FFFFFF] gap-y-7 items-center lg:w-3/4 2xl:w-4/5 lg:bg-background lg:overflow-y-auto">
        <ProfileNavigation
          v-if="hasNavigation"
          :props="props"
        />
        <div
          class="lg:px-10 xl:px-32 pb-2 xl:pb-5"
          :class="{'lg:mt-20': hasNavigation}"
        >
          <span v-if="!isLoading">
            <slot />
          </span>
          <span v-else>
            <SkeletonProfilePage />
          </span>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { useConfigStore } from "~/core/store/ConfigStore";
import { useAccountStore } from "~~/core/store/AccountStore";
export interface ProfileNavigationProps {
  title?: string;
  icon?: string;
  to?: string;
}

const props = defineProps<ProfileNavigationProps>();
const isLoading = ref(
  useAccountStore().address === "" && !useAccountStore().profile
);
const hasNavigation = props.title || props.to || props.icon;
const isProfileHome = useRoute().path === "/profile";
</script>
