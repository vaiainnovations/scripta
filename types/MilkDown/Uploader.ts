import { Uploader } from "@milkdown/plugin-upload";
import type { Node } from "prosemirror-model";
import { useIpfsStore } from "~/core/store/IpfsStore";

// Fake iamge upload
async function UploadAPI (image: File) {
  const res = await useIpfsStore().client.add(image);
  console.log(res);
  return `https://cloudflare-ipfs.com/ipfs/${res.path}`;
}

export const customUploader: Uploader = async (files, schema) => {
  const images: File[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files.item(i);
    if (!file) {
      continue;
    }

    // You can handle whatever the file type you want, we handle image here.
    if (!(file.type.includes("image") || file.type.includes("video"))) {
      continue;
    }

    images.push(file);
  }

  const nodes: Node[] = await Promise.all(
    images.map(async (file) => {
      const src = await UploadAPI(file);
      const alt = file.name;

      if (file.type.includes("image")) {
        return schema.nodes.image.createAndFill({
          src,
          alt
        }) as Node;
      } else if (file.type.includes("video")) {
        return schema.nodes.iframe.createAndFill({
          src
        });
      }
    })
  );

  return nodes;
};
