<template>
  <div>
    <div
      class="relative flex flex-col text-gray border-gray-200 border-dashed border rounded-2xl"
      :class="!isUploadingPreviewImage ? 'hover:text-primary-text' : ''"
    >
      <input
        accept="*"
        type="file"
        multiple
        class="absolute inset-0 z-50 w-full h-full p-0 m-0 outline-none opacity-0"
        :class="!isUploadingPreviewImage ? 'cursor-pointer' : 'cursor-wait'"
        title=""
        @change="handleNewPreviewImage($event)"
      >
      <div
        class="flex flex-col items-center justify-center p-4 text-center"
        :class="!useDraftStore().previewImage ? 'lg:p-10' : 'lg:p-4' "
      >
        <span
          v-if="isUploadingPreviewImage"
          class="w-full"
        >
          <img
            src="/svg/spinner/dots.svg"
            class="w-10 mx-auto h-10 m-1"
          >
          <p class="m-0 text-sm">
            Uploading the preview image...
          </p>
        </span>
        <span v-else>
          <span v-if="!useDraftStore().previewImage">
            <img
              src="/icons/linear/image.svg"
              class="w-8 h-8 m-1 mx-auto"
            >
          </span>
          <span v-else>
            <img
              :src="useDraftStore().previewImage"
              class="rounded-2xl mb-4 max-h-24 mx-auto"
            >
          </span>
          <p class="m-0 text-sm">
            Drag or click here to upload a preview image
          </p>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useDraftStore } from "~~/core/store/DraftStore";
const isUploadingPreviewImage = ref(false);

async function handleNewPreviewImage (evt: Event) {
  if (isUploadingPreviewImage.value === true) {
    // already uploading
    return;
  }
  const file = ((evt.target as HTMLInputElement).files || [])[0];

  // ensure file is an image
  if (!file.type.includes("image")) {
    useNuxtApp()
      .$useNotification()
      .error("Upload Error", "File is not supported", 6);
    return;
  }

  // ensure file is not too heavy (max 1MB)
  const maxFileSize = 1;
  if (file.size / 1024 / 1024 > maxFileSize) {
    useNuxtApp()
      .$useNotification()
      .error(
        "Upload Error",
        `Preview image is too heavy. Limit is ${maxFileSize}MB`,
        6
      );
    return;
  }
  isUploadingPreviewImage.value = true;
  try {
    const { $useIpfsUploader } = useNuxtApp();
    const uploaded = await $useIpfsUploader().uploadFile(file);
    if (uploaded) {
      useDraftStore().previewImage = `${$useIpfsUploader().gateway}${uploaded}`;
    } else {
      useNuxtApp()
        .$useNotification()
        .error(
          "Upload Error",
          "Ops, something went wrong uploading the preview image",
          6
        );
    }
  } catch (err) {
    useNuxtApp()
      .$useNotification()
      .error(
        "Upload Error",
        "Ops, something went wrong uploading the preview image",
        6
      );
  }
  isUploadingPreviewImage.value = false;
}
</script>
