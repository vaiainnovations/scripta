<template>
  <span>
    <div class="flex flex-col justify-start items-center pt-10 px-10 lg:px-20 2xl:px-32 gap-y-3.5">
      <div class="md:flex w-full">
        <div class="flex-none">
          <div class="mb-10 lg:mb-5">
            <div class="h-32 w-32 md:h-44 md:w-44 relative mx-auto md:mx-0">
              <div class="absolute inset-0 bg-cover bg-center z-0 rounded-full hover:scale-150">
                <img
                  :src="newProfilePicture || '/img/author_pic.png'"
                  class="h-32 w-32 md:h-44 md:w-44 object-contain border-2 shadow-md rounded-full border-[#EDEEFF] relative"
                >
              </div>
              <span v-if="!isUploadingProfilePic">
                <label class="opacity-0 hover:opacity-100 hover:bg-opacity-40 hover:bg-primary-text duration-300 absolute inset-0 z-10 flex justify-center items-center font-semibold rounded-full cursor-pointer" for="fileUploadProfilePic" @click="uploadProfilePic()">
                  <img
                    src="/icons/linear/cloud-upload.svg"
                    class="h-16 w-16 md:h-20 md:w-20 object-contain border-[#EDEEFF] relative"
                  >
                </label>
                <input id="fileUploadProfilePic" ref="fileUploadProfilePic" type="file" class="hidden" @change="uploadProfilePic()">
              </span>
              <span v-else>
                <div class="opacity-70 bg-background absolute inset-0 z-10 flex justify-center items-center font-semibold rounded-full cursor-progress">
                  <img
                    src="/svg/spinner/dots.svg"
                    class="h-16 w-16 md:h-20 md:w-20 object-contain border-[#EDEEFF] relative"
                  >
                </div>
              </span>

            </div>
          </div>
        </div>
        <div class="flex-grow md:pl-10">
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
          <div class="w-full flex flex-col items-center relative pt-3">
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
              class="pl-10 rounded-xl w-full border-primary-text-light border bg-background-alt text-lg text-primary-text px-7 py-1"
              placeholder="username"
              @keyup="checkUsername"
            >
            <span class="absolute text-gray-500 -translate-y-1/4 pointer-events-none pt-10 lg:pt-11 left-4">
              @
            </span>

            <span class="absolute text-gray-500 -translate-y-1/4 pointer-events-none pt-10 lg:pt-11 right-4">
              <img v-if="isValidUsername" src="/icons/linear/tick-success.svg" class="h-5 w-5">
              <img v-else src="/icons/linear/tick-error.svg" class="h-5 w-5">
            </span>
          </div>

        </div>
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
      <div v-if="isValidUsername&&!isUploadingProfilePic" class="w-full">
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
import { MsgSaveProfileEncodeObject } from "@desmoslabs/desmjs";
import { useAccountStore } from "~~/core/store/AccountStore";
const emit = defineEmits(["userEdited"]);
const newNickname = ref(useAccountStore().profile?.nickname || "");
const newUsername = ref(useAccountStore().profile?.dtag || "");
const newBio = ref(useAccountStore().profile?.bio || "");
const fileUploadProfilePic = ref("");
const newProfilePicture = ref(
  useAccountStore().profile?.pictures.profile || ""
);

const isValidUsername = ref(true);
const isUploadingProfilePic = ref(false);

function saveProfile () {
  const { $useTransaction } = useNuxtApp();
  const doNotModify = "[do-not-modify]";
  const oldProfile = useAccountStore().profile;
  const msgSaveProfile: MsgSaveProfileEncodeObject = {
    typeUrl: "/desmos.profiles.v3.MsgSaveProfile",
    value: {
      dtag:
        (oldProfile.dtag !== newUsername.value || useAccountStore().isNewProfile) ? newUsername.value : doNotModify,
      nickname:
       (oldProfile.nickname !== newNickname.value || useAccountStore().isNewProfile)
         ? newNickname.value
         : doNotModify,
      bio: (oldProfile.bio !== newBio.value || useAccountStore().isNewProfile) ? newBio.value : doNotModify,
      profilePicture:
       (oldProfile.pictures.profile !== newProfilePicture.value || useAccountStore().isNewProfile)
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
  $useTransaction().push(msgSaveProfile,
    {
      dtag: newUsername.value,
      nickname: newNickname.value,
      bio: newBio.value,
      profile: newProfilePicture.value,
      cover: oldProfile.pictures.cover,
      scriptaOp: "MsgSaveProfile"
    });
  emit("userEdited");
}

/**
 * Check username availability
 */
async function checkUsername () {
  const { $useDesmosNetwork } = useNuxtApp();
  // TODO: improve with graphql calls
  const username = newUsername.value;

  if (username === useAccountStore().profile.dtag) {
    isValidUsername.value = true;
    return;
  }

  if (!($useDesmosNetwork().usernameRegexp.test(username))) {
    isValidUsername.value = false;
    return;
  }

  try {
    const res = await (await fetch(`${$useDesmosNetwork().lcd}desmos/profiles/v3/profiles/${username}`)).json() as any;
    if (res?.profile) {
      isValidUsername.value = false;
      return;
    } else {
      isValidUsername.value = true;
    }
  } catch (e) {}
  isValidUsername.value = true;
}

async function uploadProfilePic () {
  const { $useIpfs } = useNuxtApp();
  const file: File = (fileUploadProfilePic.value as any).files[0];

  // support only image files
  if (!file.type.startsWith("image")) {
    return;
  }

  // set the new preview
  newProfilePicture.value = URL.createObjectURL(file);
  isUploadingProfilePic.value = true;

  // upload the file to IPFS
  let cid = {};
  try {
    cid = await useNuxtApp().$useIpfs().client.add(file);
  } catch (e) {
    // TODO: improve error message
    alert("ops, an error occurred while uploading the file");
  }
  if (!cid) {
    newProfilePicture.value = useAccountStore().profile.pictures.profile;
    return;
  }

  // set as image the ipfs url
  newProfilePicture.value = `${$useIpfs().gateway}${cid.path}`;
  isUploadingProfilePic.value = false;
}
</script>
