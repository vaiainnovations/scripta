import { useIpfsUploaderStore } from "~~/core/store/IpfsUploaderStore";
import { useIpfsStore } from "~~/core/store/IpfsStore";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      useIpfs: () => useIpfsStore(),
      useIpfsUploader: () => useIpfsUploaderStore()
    }
  };
});
