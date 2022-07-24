<template>
  <span>
    <div class="flex flex-col justify-start items-center px-10 gap-y-3.5 h-fit">
      <div class="w-full pb-10">
        <span
          class="cursor-pointer flex"
          @click="$emit('userEdited')"
        >
          <img
            class="w-5 h-5"
            src="/icons/bold/undo.svg"
          >
          <span class="pl-1 text-sm">
            Undo
          </span>
        </span>
      </div>
      <div class="mb-10 lg:mb-5">
        <img
          :src="useAccountStore().profile?.pictures.profile || '/img/author_pic.png'"
          class="h-32 w-32 md:h-44 md:w-44 object-contain border-2 shadow-md rounded-full border-[#EDEEFF]"
        >
      </div>
      <!-- Nickname -->
      <div class="w-full flex flex-col items-center">
        <label
          class="text-primary-text-light font-medium text-xs self-start lg:text-sm"
          for="inputNickname"
        >
          Nickname
        </label>
        <input
          id="inputNickname"
          v-model="newNickname"
          type="text"
          class="rounded-xl w-full border-primary-text-light border bg-background-alt font-bold text-xl text-primary-text px-7 py-1 lg:text-xl"
        >
      </div>

      <!-- Username -->
      <div class="w-full flex flex-col items-center">
        <label
          class="text-primary-text-light font-medium text-xs self-start lg:text-sm"
          for="inputUsername"
        >
          Username
        </label>
        <input
          id="inputUsername"
          v-model="newUsername"
          type="text"
          class="rounded-xl w-full border-primary-text-light border bg-background-alt text-lg text-primary-text px-7 py-1"
          @keyup="checkUsername"
        >
      </div>

      <!-- Bio -->
      <div class="w-full flex flex-col items-center">
        <label
          class="text-primary-text-light font-medium text-xs self-start lg:text-sm"
          for="inputBiography"
        >
          Biography
        </label>
        <textarea
          id="inputBiography"
          v-model="newBio"
          type="text"
          rows="6"
          class="rounded-xl w-full border-primary-text-light border bg-background-alt text text-primary-text px-4 py-1"
        />
      </div>

      <!-- Save -->
      <div v-if="isValidUsername" class="w-full">
        <button
          class="rounded-xl w-full border-primary-text-light border bg-primary text-background-alt text-xl px-7 py-1"
          @click="saveProfile"
        >
          Save
        </button>
      </div>
    </div>
  </span>
</template>

<script setup lang="ts">
/* import { MsgSaveProfileEncodeObject } from "@desmoslabs/desmjs"; */
import { useAccountStore } from "~~/core/store/AccountStore";
import { useDesmosStore } from "~~/core/store/DesmosStore";
import { useTransactionStore } from "~~/core/store/TransactionStore";
const emit = defineEmits(["userEdited"]);
const newNickname = ref(useAccountStore().profile?.nickname || "");
const newUsername = ref(useAccountStore().profile?.dtag || "");
const newBio = ref(useAccountStore().profile?.bio || "");
const newProfilePicture = ref(
  useAccountStore().profile?.pictures.profile || ""
);
const isValidUsername = ref(true);

function saveProfile () {
  const doNotModify = "[do-not-modify]";
  const oldProfile = useAccountStore().profile;
  const msgSaveProfile/* : MsgSaveProfileEncodeObject */ = {
    typeUrl: "/desmos.profiles.v2.MsgSaveProfile",
    value: {
      dtag:
        oldProfile.dtag !== newUsername.value ? newUsername.value : doNotModify,
      nickname:
        oldProfile.nickname !== newNickname.value
          ? newNickname.value
          : doNotModify,
      bio: oldProfile.bio !== newBio.value ? newBio.value : doNotModify,
      profilePicture:
        oldProfile.pictures.profile !== newProfilePicture.value
          ? newProfilePicture.value
          : doNotModify,
      coverPicture: doNotModify,
      creator: useAccountStore().address
    }
  };

  // Update the store
  useAccountStore().profile = {
    dtag: newUsername.value,
    nickname: newNickname.value,
    bio: newBio.value,
    pictures: {
      profile: newProfilePicture.value,
      cover: oldProfile.pictures.cover
    }
  };
  useTransactionStore().push(msgSaveProfile);
  emit("userEdited");
}

/**
 * Check username availability
 */
async function checkUsername () {
  // TODO: improve with graphql calls
  const username = newUsername.value;

  if (!(useDesmosStore().usernameRegexp.test(username))) {
    isValidUsername.value = false;
    return;
  }

  try {
    const res = await (await fetch(`${useDesmosStore().lcd}desmos/profiles/v2/profiles/${username}`)).json() as any;
    if (res?.profile) {
      isValidUsername.value = false;
      return;
    } else {
      isValidUsername.value = true;
    }
  } catch (e) {}
  isValidUsername.value = true;
}
</script>
