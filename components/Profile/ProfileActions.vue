<template>
  <div class="flex flex-col px-2">
    <div
      v-for="action in profileActions"
      :key="action.display"
      class="py-1 my-0.5 w-full px-4 cursor-pointer rounded-lg"
      :class="actualPath === action.route || '' ? 'bg-background' : 'bg-background-alt hover:bg-background/40'"
      @click="action.onClick()"
    >
      <div class="flex select-none">
        <div class="flex-none p-1 rounded-full bg-background-alt">
          <img class="h-6 w-6" :src="action.icon" loading="lazy">
        </div>
        <div class="flex-grow my-auto pl-2">
          {{ action.display }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useConfigStore } from "~/core/store/ConfigStore";

interface Action {
  display: string;
  icon: string;
  route?: string;
  onClick: () => void;
}
const actualPath = useRoute().path;
const profileActions: Action[] = [{
  display: "Profile",
  icon: "/icons/linear/profile-circle.svg",
  route: "/profile",
  onClick: () => {
    useRouter().push("/profile");
  }
}, {
  display: "Your Articles",
  icon: "/icons/broken/edit.svg",
  route: "/home",
  onClick: () => {
    useRouter().push("/home");
  }
}, {
  display: "Settings",
  icon: "/icons/linear/setting-2.svg",
  route: "/settings",
  onClick: () => {
    useRouter().push("/settings");
  }
}, {
  display: "Logout",
  icon: "/icons/linear/logout.svg",
  onClick: () => {
    logout();
  }
}];

// With the follow feature flag, update the actions and paths
if (useConfigStore().features.follow) {
  profileActions[1] = {
    display: "Your Articles",
    icon: "/icons/broken/edit.svg",
    route: "/articles", // move to the new dedicated /articles route
    onClick: () => {
      useRouter().push("/articles");
    }
  };

  // Replace the default home (with articles) with the followed writers latest posts
  profileActions.splice(1, 0, {
    display: "Following",
    icon: "/icons/linear/profile-2user.svg",
    route: "/home",
    onClick: () => {
      useRouter().push("/home");
    }
  });
}

function logout () {
  const { $useAuth } = useNuxtApp();
  $useAuth().logout("/");
}

</script>
