import { Uploader } from "@milkdown/plugin-upload";
import type { Node } from "prosemirror-model";

// Fake iamge upload
async function UploadAPI (image: File) {
  const { $useIpfsUploader } = useNuxtApp();
  const res = await $useIpfsUploader().uploadFile(image);
  return `${$useIpfsUploader().gateway}${res}`;
}

export const customUploader: Uploader = async (files, schema) => {
  const media: File[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files.item(i);
    if (!file) {
      continue;
    }

    // You can handle whatever the file type you want, we handle image here.
    if (!(file.type.includes("image") || file.type.includes("video"))) {
      useNuxtApp().$useNotification().error("Upload Error", "File is not supported", 10);
      continue;
    }

    const fileSize = file.size / 1024 / 1024;
    const maxFileSize = 20;
    if (fileSize > maxFileSize) {
      useNuxtApp().$useNotification().error("Upload Error", `File is too heavy. Limit is ${maxFileSize}MB`, 10);
      continue;
    }

    media.push(file);
  }

  const nodes: Node[] = await Promise.all(
    media.map(async (file) => {
      const src = await UploadAPI(file);

      if (file.type.includes("image")) {
        const alt = file.name;

        return schema.nodes.image.createAndFill({
          src,
          alt
        }) as Node;
      } else if (file.type.includes("video")) {
        return schema.nodes.video.createAndFill({
          file: src,
          type: file.type
        }) as Node;
      }
    })
  );

  return nodes;
};
